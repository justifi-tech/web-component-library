terraform {
  required_version = "=0.15.0"

  backend "s3" {}

  required_providers {
    aws = {
      version = "4.21.0"
      source  = "hashicorp/aws"
    }

    github = {
      version = ">= 2.7.0"
      source  = "hashicorp/github"
    }
  }
}

provider "aws" {
  region = "us-east-2"
}

provider "github" {
  owner = "justifi-tech"
}

data "terraform_remote_state" "shared_state" {
  backend   = "s3"
  workspace = var.ENVIRONMENT
  config = {
    bucket = var.REMOTE_STATE_BUCKET
    key    = "state/ecs.tfstate"
    region = "us-east-2"
  }
}

