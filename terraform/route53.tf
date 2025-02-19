resource "aws_route53_zone" "wordpress_frontend" {
  name = var.domain

  tags = local.common_tags
}

resource "aws_route53_record" "wordpress_frontend_A" {
  zone_id = aws_route53_zone.wordpress_frontend.zone_id
  name    = var.domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.wordpress_frontend.domain_name
    zone_id                = aws_cloudfront_distribution.wordpress_frontend.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_health_check" "wordpress_frontend" {
  fqdn              = local.wordpress_frontend_function_url
  port              = 443
  type              = "HTTPS"
  resource_path     = "/"
  failure_threshold = "5"
  request_interval  = "30"
  regions           = ["us-east-1", "us-west-1", "us-west-2"]

  tags = local.common_tags
}