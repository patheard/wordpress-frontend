resource "aws_cloudfront_distribution" "wordpress_frontend" {
  enabled     = true
  aliases     = [var.domain]
  price_class = "PriceClass_100"

  origin {
    domain_name = local.wordpress_frontend_function_url
    origin_id   = module.wordpress_frontend_lambda.function_name

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_read_timeout    = 60
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }

    target_origin_id       = module.wordpress_frontend_lambda.function_name
    viewer_protocol_policy = "redirect-to-https"

    min_ttl     = 1
    default_ttl = 300   # 5 minutes
    max_ttl     = 86400 # 24 hours
    compress    = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.wordpress_frontend.certificate_arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }

  tags = local.common_tags
}

resource "aws_acm_certificate" "wordpress_frontend" {
  provider = aws.us-east-1

  domain_name               = var.domain
  subject_alternative_names = ["*.${var.domain}"]
  validation_method         = "DNS"

  tags = {
    CostCentre = var.billing_code
    Terraform  = true
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "wordpress_frontend_cert_validation" {
  zone_id = aws_route53_zone.wordpress_frontend.zone_id

  for_each = {
    for dvo in aws_acm_certificate.wordpress_frontend.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  type            = each.value.type

  ttl = 60
}

resource "aws_acm_certificate_validation" "wordpress_frontend" {
  provider                = aws.us-east-1
  certificate_arn         = aws_acm_certificate.wordpress_frontend.arn
  validation_record_fqdns = [for record in aws_route53_record.wordpress_frontend_cert_validation : record.fqdn]
}