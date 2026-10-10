"""Offline replay of two exact, already published encrypted config strings.

No inputs, network, sample files, process launch, native loading or emulation.
These small string fixtures cannot reproduce or run a malware payload.
Source inner-PE SHA256:
d0bb735a344aab2dc5b874a9c928ce0bf5815c0e573ab313f8552b28aabc0601
The key is an actual ASCII literal at inner file offset520216, and is also
published by Spectrum. Offset positions are bytes in that PE, not RVAs.
"""

# The RFC 6229 test vector is a Code Component under the Simplified BSD License.
# Copyright (c) 2011 IETF Trust and the persons identified as document authors.
# All rights reserved. Source: https://www.rfc-editor.org/rfc/rfc6229
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
# 1. Redistributions of source code must retain the above copyright notice,
#    this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright notice,
#    this list of conditions and the following disclaimer in the documentation
#    and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
# LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
# SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
# INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
# CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.

import base64
import hashlib

KEY=b"MUdKjf9c8jzn5iJhFE"
FIXTURES=(
    (527232,"asD5X0Vd","da77cfe814db265121dd278bebb3cf05c7a6726ffe8cd7de441f2a7c6d8d68cf",
     "fa8847b0c33183273f5945508b31c3208a9e4ece58ca47233a05628d8dba3799"),
    (520624,"YcboTgsXIXfPFG4ZYPI+cUThqas=","92fc267b5cd9dfe57d1e238c0518bf47e93417c4b19343cda3a13c27a3a2ff64",
     "c39ee9106e1f64925813a2eb51718d2d5a7fc423bcae126192dd432087c75e91"),
)

def rc4(key,data):
    s=list(range(256));j=0
    for i in range(256):
        j=(j+s[i]+key[i%len(key)])%256;s[i],s[j]=s[j],s[i]
    i=j=0;out=bytearray()
    for byte in data:
        i=(i+1)%256;j=(j+s[i])%256;s[i],s[j]=s[j],s[i]
        out.append(byte^s[(s[i]+s[j])%256])
    return bytes(out)

def digest(data):
    return hashlib.sha256(data).hexdigest()

def main():
    if rc4(bytes([1,2,3,4,5]),bytes(16)).hex()!="b2396305f03dc027ccc3524a0a1118a8":
        raise ValueError("RC4 RFC6229 vector failed")
    for offset,encoded,source_hash,output_hash in FIXTURES:
        source=encoded.encode("ascii")
        if digest(source)!=source_hash:raise ValueError("source fixture changed")
        cipher=base64.b64decode(source,validate=True)
        output=rc4(KEY,cipher)
        if digest(output)!=output_hash:raise ValueError("decoded bytes differ")
        changed=bytes([cipher[0]^1])+cipher[1:]
        if digest(rc4(KEY,changed))==output_hash:raise ValueError("changed ciphertext was accepted")
        if digest(rc4(bytes([KEY[0]^1])+KEY[1:],cipher))==output_hash:raise ValueError("changed key was accepted")
        if digest(output+b"!")==output_hash:raise ValueError("changed output was accepted")
        display=output.decode("ascii")
        if display.startswith("http://"):
            display=display.replace("http://","hxxp://",1).replace(".","[.]")
        print(f"offset {offset}: {display}")
    print("PASS: 2 exact string replays, RFC6229 vector and 6 negative checks")

if __name__=="__main__":main()
