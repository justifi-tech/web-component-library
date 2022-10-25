/* Using upper case for root variables and reserving
* lowercase to modules and submodules variables
* */
variable "ENVIRONMENT" {
  description = "Environment for react app"
}

variable "ROOT_DOMAIN_NAME" {
  description = "Domain name used for JustiFi apps"
}

variable "REMOTE_STATE_BUCKET" {}
