output "website_endpoint" {
  value = aws_s3_bucket.www_bucket.website_endpoint
}

output "bucket_name" {
  value = aws_s3_bucket.www_bucket.bucket
}

output "bucket_aws_access_key_id" {
  value = aws_iam_access_key.www_bucket_user.id
}

output "bucket_aws_secret_access_key" {
  value     = aws_iam_access_key.www_bucket_user.secret
  sensitive = true
}
