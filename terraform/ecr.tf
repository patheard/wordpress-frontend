resource "aws_ecr_repository" "wordpress_frontend" {
  name                 = "wordpress-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}