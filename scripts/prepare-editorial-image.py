"""Export a versioned WebP derivative without publishing the private original.

Optional maintainer tool: requires Pillow, not part of the website build/runtime.
"""
import argparse
import hashlib
from io import BytesIO
import json
from pathlib import Path
import re

from PIL import Image, ImageOps


def prepare(source, url, width, height):
    if not re.fullmatch(r'/assets/img/posts/[A-Za-z0-9_./-]+\.webp', url) or any(part in ('.', '..') for part in url.split('/')):
        raise ValueError('Destination must be a local versioned WebP path under /assets/img/posts/')
    if width < 1 or height < 1 or max(width, height) > 1600:
        raise ValueError('Dimensions must be positive and at most 1600 pixels per edge')
    public = Path(__file__).resolve().parent.parent / 'public'
    output = public / url.lstrip('/')
    if output.exists():
        raise FileExistsError('Derivative exists. Choose a new versioned filename instead of overwriting it.')
    original = Path(source).read_bytes()
    with Image.open(BytesIO(original)) as input_image:
        image = ImageOps.exif_transpose(input_image).convert('RGB')
        if width > image.width or height > image.height:
            raise ValueError('Do not upscale an editorial source. Choose smaller derivative dimensions.')
        derivative = ImageOps.fit(image, (width, height), method=Image.Resampling.LANCZOS)
        buffer = BytesIO()
        derivative.save(buffer, 'WEBP', quality=82, method=6, exif=b'')
        delivered = buffer.getvalue()
    if len(delivered) > 384 * 1024:
        raise ValueError('Derivative exceeds the unchanged 384 KiB per-image budget')
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open('xb') as file:
        file.write(delivered)
    return {
        'path': url,
        'width': width,
        'height': height,
        'bytes': len(delivered),
        'sha256': hashlib.sha256(delivered).hexdigest(),
        'original_sha256': hashlib.sha256(original).hexdigest(),
        'processing': 'Proportional center crop, Lanczos resizing, WebP quality82, metadata stripped',
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', help='Private local original image path')
    parser.add_argument('destination', help='Public /assets/img/posts/...-v1.webp path')
    parser.add_argument('width', type=int)
    parser.add_argument('height', type=int)
    args = parser.parse_args()
    try:
        print(json.dumps(prepare(args.source, args.destination, args.width, args.height), indent=2))
    except (ValueError, FileExistsError) as error:
        parser.error(str(error))
