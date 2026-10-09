#!/usr/bin/env python3
import json
import ssl
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


ROOT = Path(__file__).resolve().parent
CERT = ROOT / "fedcm_repro_cert.pem"
KEY = ROOT / "fedcm_repro_key.pem"
RP_PORT = 9443
IDP_PORT = 9444


def send_json(handler, value, status=200):
    body = json.dumps(value).encode()
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    if handler.server.server_address[1] == IDP_PORT:
        handler.send_header("Set-Login", "logged-in")
    handler.send_header("Access-Control-Allow-Origin", f"https://127.0.0.1:{RP_PORT}")
    handler.send_header("Access-Control-Allow-Credentials", "true")
    handler.send_header("Cache-Control", "no-store")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


class IdpHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", f"https://127.0.0.1:{RP_PORT}")
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/.well-known/web-identity":
            send_json(self, {"provider_urls": [f"https://127.0.0.1:{IDP_PORT}/fedcm.json"]})
            return
        if parsed.path == "/fedcm.json":
            send_json(self, {
                "accounts_endpoint": f"https://127.0.0.1:{IDP_PORT}/accounts",
                "client_metadata_endpoint": f"https://127.0.0.1:{IDP_PORT}/client_metadata",
                "id_assertion_endpoint": f"https://127.0.0.1:{IDP_PORT}/id_assertion",
                "login_url": f"https://127.0.0.1:{IDP_PORT}/login",
                "branding": {
                    "background_color": "#ffffff",
                    "color": "#202124"
                }
            })
            return
        if parsed.path == "/accounts":
            send_json(self, {"accounts": [
                {
                    "id": "account-1",
                    "name": "FedCM Test User One",
                    "email": "fedcm-user-1@example.test",
                    "given_name": "FedCM One",
                    "picture": f"https://127.0.0.1:{IDP_PORT}/avatar.png"
                },
                {
                    "id": "account-2",
                    "name": "FedCM Test User Two",
                    "email": "fedcm-user-2@example.test",
                    "given_name": "FedCM Two",
                    "picture": f"https://127.0.0.1:{IDP_PORT}/avatar.png"
                }
            ]})
            return
        if parsed.path == "/client_metadata":
            send_json(self, {
                "privacy_policy_url": f"https://127.0.0.1:{IDP_PORT}/privacy",
                "terms_of_service_url": f"https://127.0.0.1:{IDP_PORT}/terms"
            })
            return
        if parsed.path in ("/login", "/privacy", "/terms"):
            self.send_html("<!doctype html><title>IdP</title><p>IdP page</p>")
            return
        if parsed.path == "/avatar.png":
            self.send_response(204)
            self.end_headers()
            return
        self.send_error(404)

    def do_POST(self):
        if self.path == "/id_assertion":
            length = int(self.headers.get("Content-Length", "0"))
            parse_qs(self.rfile.read(length).decode())
            send_json(self, {"token": "fedcm-test-token"})
            return
        self.send_error(404)

    def send_html(self, html):
        body = html.encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        print(f"[idp] {self.address_string()} {fmt % args}", flush=True)


class RpHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/" or parsed.path.startswith("/index"):
            self.send_html(f"""<!doctype html>
<meta charset="utf-8">
<title>FedCM tab dialog repro</title>
<h1>FedCM tab dialog repro</h1>
<pre id="log"></pre>
<script>
const log = (m) => {{
  document.getElementById('log').textContent += new Date().toISOString() + ' ' + m + '\\n';
  console.log(m);
}};

async function run() {{
  log('starting fedcm request');
  const credentialPromise = navigator.credentials.get({{
    identity: {{
      providers: [{{
        configURL: 'https://127.0.0.1:{IDP_PORT}/fedcm.json',
        clientId: 'fedcm-client',
        params: {{ nonce: 'nonce-1' }}
      }}]
    }}
  }}).then(c => log('credential resolved ' + (c && c.token)))
    .catch(e => log('credential error ' + e.name + ': ' + e.message));

  setTimeout(() => {{
    log('opening auto-return foreground tab');
    const w = window.open('/return.html', '_blank');
    log('opened=' + Boolean(w));
  }}, 1200);

  await credentialPromise;
}}
run();
</script>""")
            return
        if parsed.path == "/return.html":
            self.send_html("""<!doctype html>
<meta charset="utf-8">
<title>Return tab</title>
<pre>Returning to opener...</pre>
<script>
setTimeout(() => {
  console.log('return tab closing');
  if (opener) opener.focus();
  window.close();
}, 900);
</script>""")
            return
        if parsed.path == "/hold.html":
            self.send_html("""<!doctype html>
<meta charset="utf-8">
<title>Hold tab</title>
<pre>Holding foreground tab.</pre>
<script>
console.log('hold tab loaded');
</script>""")
            return
        self.send_error(404)

    def send_html(self, html):
        body = html.encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        print(f"[rp] {self.address_string()} {fmt % args}", flush=True)


def serve(port, handler):
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(CERT, KEY)
    server.socket = context.wrap_socket(server.socket, server_side=True)
    print(f"serving https://127.0.0.1:{port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    for port, handler in ((RP_PORT, RpHandler), (IDP_PORT, IdpHandler)):
        threading.Thread(target=serve, args=(port, handler), daemon=True).start()
    threading.Event().wait()
