module "s3" {
  source           = "./modules/s3"
  environment      = var.ENVIRONMENT
  bucket_name      = local.application_id
  iam_user         = "${local.application_name}-deploy-user"
  application_name = local.application_name
}

module "gh" {
  source      = "./modules/gh"
  environment = var.ENVIRONMENT
  repo        = local.application_name

  # Setting our app secrets for GH Actions
  aws_bucket_name       = module.s3.bucket_name
  aws_access_key_id     = module.s3.bucket_aws_access_key_id
  aws_secret_access_key = module.s3.bucket_aws_secret_access_key
}

module "cf" {
  source           = "./modules/cf"
  website_endpoint = module.s3.website_endpoint
  www_domain_name  = local.fqdn_domain_name
  root_domain_name = var.ROOT_DOMAIN_NAME
}

