locals {
  common_tags = {
    Terraform  = "true"
    CostCentre = var.billing_code
  }
  wordpress_frontend_function_url = split("/", aws_lambda_function_url.wordpress_frontend_lambda.function_url)[2]
}