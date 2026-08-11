#!/usr/bin/env bash
# Instala la CA raíz de FortiGate (inspección SSL) en el trust store de Linux.
# Uso:
#   ./scripts/install-fortinet-ca.sh /ruta/a/Fortinet_CA_SSL.crt
#   ./scripts/install-fortinet-ca.sh   # busca en ~/Downloads y ./certs/

set -euo pipefail

CA_NAME="fortinet-ca-ucasal"
CA_DIR="/usr/local/share/ca-certificates"
EXPECTED_ISSUER="FG6H0ETB21902486"

info() { printf '\033[1;34m→\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*"; }
err()  { printf '\033[1;31m✗\033[0m %s\n' "$*" >&2; }

resolve_ca_file() {
  if [[ "${1:-}" != "" ]]; then
    echo "$1"
    return
  fi

  local candidates=(
    "$HOME/Downloads/Fortinet_CA_SSL.crt"
    "$HOME/Downloads/Fortinet_CA_SSL.cer"
    "$HOME/Downloads/fortinet-ca.crt"
    "$PWD/certs/Fortinet_CA_SSL.crt"
    "$PWD/certs/fortinet-ca.crt"
  )

  for file in "${candidates[@]}"; do
    if [[ -f "$file" ]]; then
      echo "$file"
      return
    fi
  done
}

print_it_request() {
  cat <<EOF

--- Solicitud para sistemas / IT ---

Asunto: Certificado CA FortiGate para inspección SSL (FG6H0ETB21902486)

Hola, necesito el certificado raíz (CA) de FortiGate usado para inspección SSL
en la red institucional, para instalarlo en mi equipo Linux y evitar errores
ERR_CERT_AUTHORITY_INVALID al acceder a sitios HTTPS (p. ej. ucanode.app).

Datos detectados en mi red:
  - Emisor (CA): CN=${EXPECTED_ISSUER}, O=Fortinet
  - Error: net::ERR_CERT_AUTHORITY_INVALID / unable to get local issuer certificate
  - Certificado esperado en FortiGate: Fortinet_CA_SSL (System > Certificates > Download)

Formato solicitado: .crt o .pem (certificado raíz, no el certificado del sitio).

Instalación en Linux (Ubuntu/Debian):
  sudo cp Fortinet_CA_SSL.crt /usr/local/share/ca-certificates/${CA_NAME}.crt
  sudo update-ca-certificates

Gracias.

EOF
}

if [[ "${1:-}" == "--info" || "${1:-}" == "--solicitud-it" ]]; then
  print_it_request
  exit 0
fi

if [[ "$(id -u)" -eq 0 ]]; then
  err "No ejecutes este script con sudo. Te pedirá la contraseña solo al copiar la CA."
  exit 1
fi

CA_FILE="$(resolve_ca_file "${1:-}")"

if [[ -z "$CA_FILE" || ! -f "$CA_FILE" ]]; then
  err "No se encontró el certificado CA de Fortinet."
  echo
  warn "Pedilo a sistemas/IT o descargalo desde el FortiGate (Fortinet_CA_SSL)."
  warn "Luego ejecutá: ./scripts/install-fortinet-ca.sh /ruta/al/certificado.crt"
  echo
  print_it_request
  exit 1
fi

info "Verificando certificado: $CA_FILE"

SUBJECT="$(openssl x509 -in "$CA_FILE" -noout -subject 2>/dev/null || true)"
ISSUER="$(openssl x509 -in "$CA_FILE" -noout -issuer 2>/dev/null || true)"

if [[ -z "$SUBJECT" ]]; then
  err "El archivo no parece un certificado X.509 válido."
  exit 1
fi

info "Subject: $SUBJECT"
info "Issuer:  $ISSUER"

if [[ "$SUBJECT" != *"ucanode.app"* ]]; then
  ok "Parece un certificado CA (no es el leaf de ucanode.app)."
else
  err "Este es el certificado del sitio (leaf), no la CA raíz."
  err "Necesitás Fortinet_CA_SSL (CN=${EXPECTED_ISSUER}), no el cert de ucanode.app."
  exit 1
fi

TARGET="${CA_DIR}/${CA_NAME}.crt"
info "Instalando en $TARGET ..."
sudo cp "$CA_FILE" "$TARGET"
sudo update-ca-certificates

ok "CA instalada. Reiniciá Cursor y el navegador."
info "Verificá con: curl -I https://ucanode.app"
