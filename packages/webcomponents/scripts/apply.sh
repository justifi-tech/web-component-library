#!/bin/bash -e

GIT_COMMIT_HASH=$(git rev-parse --short HEAD)
ENVIRONMENT="$1"

test -n "$ENVIRONMENT" || (>&2 echo -ne "Usage:\n, $0 <dev|staging|production>"; exit 1)
WORKSPACE="$ENVIRONMENT"

cd $(dirname $0)/../terraform
terraform init -backend-config=environments/$ENVIRONMENT-backend.tfvars
terraform workspace new $WORKSPACE || terraform workspace select $WORKSPACE
terraform apply -var-file=environments/$ENVIRONMENT.tfvars -auto-approve 

