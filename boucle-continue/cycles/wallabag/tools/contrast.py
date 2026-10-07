#!/usr/bin/env python3
"""Contrast WCAG — ratio(L1,L2) entre deux couleurs hex."""
import sys, re

def lin(c):
    c /= 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def lum(hexs):
    hexs = hexs.lstrip('#')
    r, g, b = (int(hexs[i:i+2], 16) for i in (0, 2, 4))
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)

if __name__ == '__main__':
    for pair in sys.argv[1:]:
        a, b = pair.split(':')
        print(f'{a} on {b} = {ratio(a, b):.2f}')
