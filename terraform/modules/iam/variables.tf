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

variable "dynamodb_table_arns" {
  type    = list(string)
  default = []
}
