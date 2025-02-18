module "wordpress_frontend_lambda" {
  source    = "github.com/cds-snc/terraform-modules//lambda?ref=v10.3.0"
  name      = "wordpress-frontend"
  ecr_arn   = aws_ecr_repository.wordpress_frontend.arn
  image_uri = "${aws_ecr_repository.wordpress_frontend.repository_url}:latest"

  memory                 = 1024
  timeout                = 120
  enable_lambda_insights = true

  environment_variables = {
    SITE_NAME_EN       = var.site_name_en
    SITE_NAME_FR       = var.site_name_fr
    WORDPRESS_URL      = var.wordpress_url
    WORDPRESS_USER     = var.wordpress_user
    WORDPRESS_PASSWORD = var.wordpress_password
  }

  billing_tag_value = var.billing_code
}

resource "aws_lambda_function_url" "wordpress_frontend_lambda" {
  function_name      = module.wordpress_frontend_lambda.function_name
  authorization_type = "NONE"
}