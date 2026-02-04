variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "ecs_cluster_name" {
  type = string
}

variable "ecs_service_name" {
  type = string
}

variable "task_execution_role_arn" {
  type = string
}

variable "frontend_bucket_arn" {
  type = string
}

variable "frontend_distribution_arn" {
  type = string
}
