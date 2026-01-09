output "cluster_id" {
  value = aws_ecs_cluster.this.id
}

output "cluster_arn" {
  value = aws_ecs_cluster.this.arn
}

output "service_name" {
  value = aws_ecs_service.this.name
}

output "service_arn" {
  value = aws_ecs_service.this.arn
}

output "task_execution_role_arn" {
  value = aws_iam_role.task_execution.arn
}

output "alb_dns_name" {
  value = aws_lb.this.dns_name
}

output "service_security_group_id" {
  value = aws_security_group.service.id
}

output "alb_security_group_id" {
  value = aws_security_group.alb.id
}
