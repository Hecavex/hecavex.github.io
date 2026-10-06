"""Offline Suricata 8.0.3 syntax and synthetic PCAP test. No packets are sent.

python3 validate_suricata.py --config /etc/suricata/suricata.yaml
"""
import argparse
import hashlib
import ipaddress
import json
from pathlib import Path
import struct
import subprocess
import tempfile

ENGINE_VERSION = "8.0.3"
SID = 420260801


def checksum(data):
    if len(data) % 2:
        data += b"\0"
    total = sum(struct.unpack(f"!{len(data)//2}H", data))
    while total >> 16:
        total = (total & 65535) + (total >> 16)
    return (~total) & 65535


def packet(src, dst, sport, dport, seq, ack, flags, payload=b""):
    source, target = ipaddress.ip_address(src).packed, ipaddress.ip_address(dst).packed
    tcp = struct.pack("!HHIIBBHHH", sport, dport, seq, ack, 5 << 4, flags, 65535, 0, 0) + payload
    check = checksum(source + target + struct.pack("!BBH", 0, 6, len(tcp)) + tcp)
    tcp = tcp[:16] + struct.pack("!H", check) + tcp[18:]
    ip = struct.pack("!BBHHHBBH4s4s", 0x45, 0, 20 + len(tcp), 1, 0, 64, 6, 0, source, target)
    ip = ip[:10] + struct.pack("!H", checksum(ip)) + ip[12:]
    return bytes.fromhex("0200000000020200000000010800") + ip + tcp


def fixture(path):
    cases = [
        ("positive", 41001, "84.32.102.230", "/p?h=example.invalid&u=/safe", 0, False, True),
        ("duplicate-segment", 41002, "84.32.102.230", "/p?h=example.invalid&u=/safe", 0, True, True),
        ("delayed-request-60s", 41003, "84.32.102.230", "/p?h=example.invalid&u=/safe", 60, False, True),
        ("missing-u-field", 41004, "84.32.102.230", "/p?h=example.invalid", 0, False, False),
        ("legitimate-other-destination", 41005, "192.0.2.20", "/p?h=example.invalid&u=/safe", 0, False, False),
        ("no-http-request", 41006, "84.32.102.230", None, 0, False, False),
        # Identical observable HTTP bytes cannot reveal benign intent. This
        # intentionally alerts and documents the rule's discrimination limit.
        ("benign-intent-identical-wire-shape", 41007, "84.32.102.230", "/p?h=example.invalid&u=/safe", 0, False, True),
    ]
    packets = []
    for index, (_, port, destination, uri, delay, duplicate, _) in enumerate(cases):
        base = 1700000000 + index * 100
        client = "10.23.0.2"
        packets.extend([
            (base, packet(client, destination, port, 7744, 100, 0, 2)),
            (base + .01, packet(destination, client, 7744, port, 200, 101, 18)),
            (base + .02, packet(client, destination, port, 7744, 101, 201, 16)),
        ])
        if uri:
            payload = f"GET {uri} HTTP/1.1\r\nHost: example.invalid\r\nConnection: close\r\n\r\n".encode()
            request = packet(client, destination, port, 7744, 101, 201, 24, payload)
            packets.append((base + .03 + delay, request))
            if duplicate:
                packets.append((base + .04 + delay, request))
            packets.append((base + .05 + delay, packet(destination, client, 7744, port, 201, 101 + len(payload), 16)))
    with path.open("wb") as output:
        output.write(struct.pack("<IHHIIII", 0xa1b2c3d4, 2, 4, 0, 0, 65535, 1))
        for timestamp, data in sorted(packets, key=lambda item: item[0]):
            seconds = int(timestamp)
            output.write(struct.pack("<IIII", seconds, round((timestamp - seconds) * 1000000), len(data), len(data)))
            output.write(data)
    return cases


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", default="/etc/suricata/suricata.yaml")
    parser.add_argument("--engine", default="suricata")
    args = parser.parse_args()
    version = subprocess.check_output([args.engine, "-V"], text=True, timeout=30).strip()
    if f"version {ENGINE_VERSION} " not in version:
        raise SystemExit(f"Expected pinned Suricata {ENGINE_VERSION}, got {version}")
    rules = Path(__file__).resolve().with_name("telemetry.rules")
    with tempfile.TemporaryDirectory(prefix="hecavex-suricata-") as directory:
        root = Path(directory)
        cases = fixture(root / "harmless.pcap")
        common = [args.engine, "-c", args.config, "-S", str(rules), "-l", str(root),
                  "--set", "vars.address-groups.HOME_NET=[10.0.0.0/8]"]
        def run(arguments):
            result = subprocess.run(arguments, capture_output=True, text=True, timeout=120)
            if result.returncode:
                raise RuntimeError(result.stdout + result.stderr)
            return result
        run(common + ["-T"])
        result = run(common + ["-r", str(root / "harmless.pcap"), "--runmode", "single"])
        events = [json.loads(line) for line in (root / "eve.json").read_text().splitlines()]
        alerts = [event for event in events if event.get("alert", {}).get("signature_id") == SID]
        actual = sorted(event["src_port"] for event in alerts)
        expected = sorted(port for _, port, _, _, _, _, should_alert in cases if should_alert)
        if actual != expected:
            raise AssertionError({"expectedPorts": expected, "actualPorts": actual, "stderr": result.stderr})
        print(json.dumps({"engine": version, "syntax": "PASS",
            "ruleSha256": hashlib.sha256(rules.read_bytes()).hexdigest(),
            "fixtureSha256": hashlib.sha256((root / "harmless.pcap").read_bytes()).hexdigest(), "fixtures": [
            {"id": name, "sourcePort": port, "expectedAlerts": int(should_alert),
             "actualAlerts": actual.count(port)} for name, port, _, _, _, _, should_alert in cases
        ], "scope": "Synthetic offline PCAP execution only. No connector or production efficacy validation."}, indent=2))


if __name__ == "__main__":
    main()
