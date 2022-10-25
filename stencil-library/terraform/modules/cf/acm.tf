data "aws_acm_certificate" "issued" {
  provider = aws.us-east-1

  domain   = var.www_domain_name
  statuses = ["ISSUED"]
}

