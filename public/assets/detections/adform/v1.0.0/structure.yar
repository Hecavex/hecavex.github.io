rule HECAVEX_Adform_Clipper_2026
{
  meta:
    description = "Detects archived Adform browser crypto-clipper structure"
    author = "HECAVEX"
    date = "2026-08-08"
    tlp = "CLEAR"

  strings:
    $key  = "var _k=[0x4d,0x33,0x77,0x54,0x77,0x30]" ascii
    $c2   = "84.32.102.230:7744" ascii
    $clip = "navigator.clipboard.readText" ascii
    $hook = "Object.getOwnPropertyDescriptor(HTMLInputElement.prototype" ascii
    $walk = "document.createTreeWalker" ascii

  condition:
    filesize < 500KB and 3 of them
}
