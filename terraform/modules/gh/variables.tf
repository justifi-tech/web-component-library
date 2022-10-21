variable "environment" {
  description = "The environment"
}

variable "repo" {
  description = "The Github repo"
}

variable "aws_bucket_name" {
  description = "The AWS S3 bucket "
}

variable "aws_access_key_id" {
  description = "The access key for bucket upload"
}

variable "aws_secret_access_key" {
  description = "The access secret key for bucket upload"
}
