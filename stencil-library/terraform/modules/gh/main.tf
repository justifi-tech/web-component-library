resource "github_actions_secret" "bucket_name" {
  repository      = var.repo
  secret_name     = "AWS_${upper(var.environment)}_BUCKET_NAME"
  plaintext_value = var.aws_bucket_name
}

resource "github_actions_secret" "aws_access_key_id" {
  repository      = var.repo
  secret_name     = "AWS_ACCESS_KEY_ID_${upper(var.environment)}"
  plaintext_value = var.aws_access_key_id
}

resource "github_actions_secret" "aws_secret_access_key" {
  repository      = var.repo
  secret_name     = "AWS_SECRET_ACCESS_KEY_${upper(var.environment)}"
  plaintext_value = var.aws_secret_access_key
}
