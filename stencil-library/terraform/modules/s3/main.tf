resource "aws_s3_bucket" "www_bucket" {
  bucket = var.bucket_name

  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket_website_configuration" "www_bucket_configuration" {
  bucket = aws_s3_bucket.www_bucket.bucket

  index_document {
    suffix = "index.js"
  }

  error_document {
    key = "error.html"
  }

  routing_rule {
    condition {
      key_prefix_equals = "docs/"
    }
    redirect {
      replace_key_prefix_with = "documents/"
    }
  }
}

resource "aws_s3_bucket_acl" "www_bucket_acl" {
  bucket = aws_s3_bucket.www_bucket.id
  acl    = "public-read"
}

resource "aws_iam_user" "www_bucket_user" {
  name = var.iam_user
}

resource "aws_iam_access_key" "www_bucket_user" {
  user = aws_iam_user.www_bucket_user.name
}

resource "aws_iam_user_policy" "www_bucket_user_policy" {
  name = "${var.iam_user}-deploy-policy"
  user = aws_iam_user.www_bucket_user.name

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "s3:ListAllMyBuckets",
            "Resource": "arn:aws:s3:::*"
        },
        {
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::${var.bucket_name}",
                "arn:aws:s3:::${var.bucket_name}/*"
            ]
        }
    ]
}
  EOF
}
