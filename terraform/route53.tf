resource "aws_route53_health_check" "wordpress_frontend" {
  fqdn = trimsuffix(
    trimprefix(
      aws_lambda_function_url.wordpress_frontend_lambda.function_url,
      "https://"
    ),
    "/"
  )
  port              = 443
  type              = "HTTPS"
  resource_path     = "/"
  failure_threshold = "5"
  request_interval  = "30"
  regions           = ["us-east-1", "us-west-1", "us-west-2"]

  tags = local.common_tags
}