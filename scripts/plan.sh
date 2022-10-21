#!/bin/bash -e

ENVIRONMENT="$1"

test -n "$ENVIRONMENT" || (
  echo >&2 -ne "Usage:\n, $0 <staging|production>"
  exit 1
)

WORKSPACE="$ENVIRONMENT"

cd $(dirname $0)/../terraform
terraform init -upgrade=true -backend-config=environments/$ENVIRONMENT-backend.tfvars
terraform workspace select $WORKSPACE || terraform workspace new $WORKSPACE
terraform plan -var-file=environments/$ENVIRONMENT.tfvars

