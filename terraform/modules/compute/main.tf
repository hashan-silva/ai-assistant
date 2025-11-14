variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "service_count" {
  type    = number
  default = 2
}

resource "aws_ecs_cluster" "this" {
  name = "${var.project}-${var.environment}-cluster"
}

output "cluster_name" {
  value = aws_ecs_cluster.this.name
}
