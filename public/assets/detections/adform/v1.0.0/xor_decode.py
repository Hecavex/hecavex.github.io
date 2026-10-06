def xor_decode(values: list[int], key: bytes) -> str:
    return bytes(
        value ^ key[index % len(key)]
        for index, value in enumerate(values)
    ).decode("utf-8", errors="strict")
