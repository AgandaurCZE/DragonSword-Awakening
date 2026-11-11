"""Build and serve the same site GitHub publishes: python3 tools/serve_site.py [--port 8000]."""
import argparse
import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from tempfile import TemporaryDirectory
from build_site import build

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    with TemporaryDirectory(prefix='dragonsword_site_') as directory:
        build(directory)
        handler = functools.partial(SimpleHTTPRequestHandler, directory=directory)
        with ThreadingHTTPServer(('127.0.0.1', args.port), handler) as server:
            print(f'Open http://127.0.0.1:{server.server_port}/', flush=True)
            try:
                server.serve_forever()
            except KeyboardInterrupt:
                pass
