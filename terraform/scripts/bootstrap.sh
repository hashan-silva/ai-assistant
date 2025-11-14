#!/usr/bin/env bash
set -euo pipefail

ENV_DIR=${1:-dev}
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ENV_PATH="${SCRIPT_DIR}/../envs/${ENV_DIR}"

if [ ! -d "${ENV_PATH}" ]; then
  echo "Unknown environment: ${ENV_DIR}" >&2
  exit 1
fi

pushd "${ENV_PATH}" >/dev/null
terraform init
terraform plan "$@"
popd >/dev/null
