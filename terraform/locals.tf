locals {
  application_name = "web-component-libarary"
  application_id   = "${local.application_name}-${var.ENVIRONMENT}"
  fqdn_domain_name = "${local.application_name}.${var.ROOT_DOMAIN_NAME}"
}
