# Local audit binaries (not committed)

| Tool | Path | Install |
|------|------|---------|
| Gitleaks | `tools/gitleaks/gitleaks.exe` | Downloaded from [gitleaks releases](https://github.com/gitleaks/gitleaks/releases) (v8.30.1) |
| OWASP ZAP Core | `tools/zap/ZAP_2.17.0/` | [ZAP_2.17.0_Core.zip](https://github.com/zaproxy/zaproxy/releases/download/v2.17.0/ZAP_2.17.0_Core.zip) |

Semgrep is installed as a user tool via `uv tool install semgrep` (on PATH as `semgrep`).

Alternative for ZAP: start Docker Desktop and use `docker pull ghcr.io/zaproxy/zaproxy:stable`.
