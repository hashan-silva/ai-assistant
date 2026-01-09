resource "aws_codebuild_project" "this" {
  name         = "${var.project}-${var.environment}-codebuild"
  service_role = var.service_role_arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type                = var.compute_type
    image                       = var.build_image
    type                        = "LINUX_CONTAINER"
    privileged_mode             = true
    image_pull_credentials_type = "CODEBUILD"
  }

  source {
    type = "NO_SOURCE"
  }
}
