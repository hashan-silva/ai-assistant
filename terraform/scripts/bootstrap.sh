#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ROOT_PATH="${SCRIPT_DIR}/.."
pushd "${ROOT_PATH}" >/dev/null
terraform init
terraform plan "$@"
popd >/dev/null
