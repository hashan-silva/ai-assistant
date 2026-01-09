output "vpc_id" {
  value = module.network.vpc_id
}

output "public_subnet_ids" {
  value = module.network.public_subnet_ids
}

output "alb_dns_name" {
  value = module.compute.alb_dns_name
}

output "ecs_cluster_id" {
  value = module.compute.cluster_id
}

output "ecs_service_name" {
  value = module.compute.service_name
}

output "deploy_user_name" {
  value = module.iam.user_name
}

output "deploy_access_key_id" {
  value = module.iam.access_key_id
}

output "deploy_secret_access_key" {
  value     = module.iam.secret_access_key
  sensitive = true
}
