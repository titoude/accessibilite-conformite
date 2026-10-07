#!/usr/bin/env python3
"""Proxy CDP 'spawn-per-connection' — émule dgtlmoon/sockpuppetbrowser en local.

Pourquoi : le fetcher pyppeteer de changedetection.io appelle browser.close() en
fin de fetch, ce qui tue un chromium remote-debugging partagé. Amont attend un
service qui respawne un navigateur par connexion ws. Ce proxy écoute
ws://127.0.0.1:PORT (n'importe quel chemin), lance un chromium frais par
connexion entrante, relaie les frames dans les deux sens, puis tue le chromium à
la fermeture. PLAYWRIGHT_DRIVER_URL pointe sur le proxy :
  ws://127.0.0.1:9333/devtools/browser/local

Usage : venv/bin/python tools/cdp-spawn-proxy.py  (env: CDP_PORT=9333, CHROME_BIN=...)
"""
import asyncio
import json
import os
import random
import shutil
import socket
import subprocess
import tempfile
import urllib.request

import websockets

CDP_PORT = int(os.environ.get("CDP_PORT", "9333"))
CHROME = os.environ.get(
    "CHROME_BIN",
    "/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
)
BASE_PORT = 42000


def free_port():
    for _ in range(50):
        p = random.randint(BASE_PORT, BASE_PORT + 8000)
        with socket.socket() as s:
            try:
                s.bind(("127.0.0.1", p))
                return p
            except OSError:
                continue
    raise RuntimeError("no free port")


async def spawn_browser():
    port = free_port()
    prof = tempfile.mkdtemp(prefix="cd-chrome-")
    proc = subprocess.Popen(
        [
            CHROME,
            "--headless=new",
            f"--remote-debugging-port={port}",
            "--remote-debugging-address=127.0.0.1",
            "--no-sandbox",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            f"--user-data-dir={prof}",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    ws_url = None
    for _ in range(80):
        if proc.poll() is not None:
            break
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{port}/json/version", timeout=1) as r:
                ws_url = json.load(r)["webSocketDebuggerUrl"]
                break
        except Exception:
            await asyncio.sleep(0.25)
    if not ws_url:
        proc.kill()
        shutil.rmtree(prof, ignore_errors=True)
        raise RuntimeError("chromium did not publish /json/version")
    return proc, prof, ws_url


async def pipe(a, b):
    async for msg in a:
        await b.send(msg)


async def handle(client):
    proc = prof = None
    try:
        proc, prof, ws_url = await spawn_browser()
        async with websockets.connect(ws_url, max_size=None) as upstream:
            await asyncio.gather(
                pipe(client, upstream),
                pipe(upstream, client),
                return_exceptions=True,
            )
    except Exception as e:
        try:
            print(f"[cdp-proxy] session error: {e}", flush=True)
        except Exception:
            pass
    finally:
        if proc:
            try:
                proc.terminate()
                proc.wait(timeout=5)
            except Exception:
                try:
                    proc.kill()
                except Exception:
                    pass
        if prof:
            shutil.rmtree(prof, ignore_errors=True)


async def main():
    print(f"[cdp-proxy] listening ws://127.0.0.1:{CDP_PORT} (spawn-per-connection -> {CHROME})", flush=True)
    async with websockets.serve(handle, "127.0.0.1", CDP_PORT, max_size=None):
        await asyncio.Future()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
