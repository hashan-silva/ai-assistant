variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "frontend_image" {
  type = string
}

variable "backend_image" {
  type = string
}

variable "ollama_image" {
  type    = string
  default = "ollama/ollama:latest"
}

variable "task_cpu" {
  type    = string
  default = "1024"
}

variable "task_memory" {
  type    = string
  default = "2048"
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "container_port" {
  type    = number
  default = 3000
}

variable "dynamodb_table_arns" {
  type    = list(string)
  default = []
}

variable "dynamodb_table_names" {
  type    = map(string)
  default = {}
}

variable "cognito_user_pool_client_id" {
  type = string
}

variable "cognito_user_pool_id" {
  type = string
}
