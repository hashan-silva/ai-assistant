variable "project" {
  type    = string
  default = "ai-assistant"
}

variable "environment" {
  type    = string
  default = "ai-assistant"
}

variable "aws_region" {
  type    = string
  default = "eu-north-1"
}

variable "backend_image" {
  type = string
}

variable "ollama_image" {
  type    = string
  default = "ollama/ollama:latest"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
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
