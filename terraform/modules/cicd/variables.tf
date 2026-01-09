variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "service_role_arn" {
  type = string
}

variable "build_image" {
  type    = string
  default = "aws/codebuild/standard:7.0"
}

variable "compute_type" {
  type    = string
  default = "BUILD_GENERAL1_SMALL"
}
