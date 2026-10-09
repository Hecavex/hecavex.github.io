"""One fixed, harmless constant-data replay. No Lua interpreter or sample import.

This mathematical reimplementation is based on Prometheus.
Based on Prometheus by Elias Oelschner, https://github.com/prometheus-lua/Prometheus
The pinned custom license is included in LICENSE-Prometheus.txt.
"""
from pathlib import Path
import hashlib
import json


def require(condition, message):
    if not condition:
        raise ValueError(message)


def transform(cipher, seed):
    """Integer arithmetic on at most 174 constant bytes, never source evaluation."""
    require(isinstance(cipher, bytes) and len(cipher) == 174, 'expected 174 ciphertext bytes')
    require(type(seed) is int and 0 <= seed < 2**53, 'seed outside exact-integer bound')
    state45, state8 = seed % (1 << 45), seed % 255 + 2
    previous, pending, result = 68, [], bytearray()
    for encrypted in cipher:
        if not pending:
            state45 = (state45 * 241 + 31330050365433) % (1 << 45)
            for _ in range(256):
                state8 = (state8 * 186) % 257
                if state8 != 1:
                    break
            else:
                raise ValueError('no accepted modulo-257 state')
            rotation = state8 % 32
            shift = 13 - (state8 - rotation) // 32
            word = (state45 >> shift) & 0xffffffff
            rotated = ((word >> rotation) | (word << (32 - rotation))) & 0xffffffff
            pending = [(rotated >> bit) & 255 for bit in (0, 8, 16, 24)]
        # The last list element is the high byte, consumed first.
        previous = (encrypted + pending.pop() + previous) % 256
        result.append(previous)
    return bytes(result)


def validate_output(plain, expected, expected_sha):
    require(plain == expected, 'plaintext byte mismatch')
    require(hashlib.sha256(plain).hexdigest() == expected_sha, 'plaintext hash mismatch')
    require(json.loads(plain) == {
        'jsonrpc': '2.0', 'method': 'eth_call',
        'params': [{'to': '%s', 'data': '%s'}, 'latest'], 'id': 1
    }, 'not the placeholders-only JSON template')


def main():
    # Read only this authored, fixed JSON fixture, never any Lua, DLL or archive.
    fixture_path = Path(__file__).with_name('fixture.json')
    with fixture_path.open('rb') as handle:
        raw = handle.read(16385)
    require(len(raw) <= 16384, 'fixture size bound')
    fixture = json.loads(raw)
    require(fixture['schema'] == 'hecavex.harmless-constant-replay.v1', 'unexpected fixture')
    require(fixture['seed'] == 28217191696788, 'unexpected selected seed')
    require(len(fixture['ciphertext_hex']) == 348, 'ciphertext hex size bound')
    cipher = bytes.fromhex(fixture['ciphertext_hex'])
    require(hashlib.sha256(cipher).hexdigest() ==
            '2807ea9e86ae814427e1c7ceb9c22aec73e63b70d8a94b0a9f30c9dd8f5d079b',
            'ciphertext hash mismatch')
    expected = fixture['expected_plaintext_utf8'].encode('utf-8')
    expected_sha = '487190fca26fbf3acf04520ce3ab7e7447a4d11453003591edd2de51c0f4bf4c'
    require(len(expected) == 174, 'expected template size bound')
    plain = transform(cipher, fixture['seed'])
    validate_output(plain, expected, expected_sha)

    # Negative controls test this authored helper, not a malware detection rule.
    changed_cipher = bytes([cipher[0] ^ 1]) + cipher[1:]
    require(transform(changed_cipher, fixture['seed']) != expected, 'changed cipher accepted')
    require(transform(cipher, fixture['seed'] + 1) != expected, 'changed seed accepted')
    changed_output = expected[:-1] + bytes([expected[-1] ^ 1])
    try:
        validate_output(changed_output, expected, expected_sha)
    except ValueError:
        pass
    else:
        raise ValueError('changed output accepted')

    print('Based on Prometheus by Elias Oelschner, https://github.com/prometheus-lua/Prometheus')
    print('PASS: fixed 174-byte ciphertext and placeholders-only JSON template.')
    print('PASS: changed ciphertext, changed seed and changed output controls.')
    print('Plaintext SHA-256:', expected_sha)
    print(plain.decode('utf-8'), end='')
    print('Limit: constant arithmetic is not observed execution or resolved callee identity.')


if __name__ == '__main__':
    main()
