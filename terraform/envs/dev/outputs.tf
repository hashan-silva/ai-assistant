output "vpc_id" {
  value = module.network.vpc_id
}

output "cluster_name" {
  value = module.compute.cluster_name
}

output "db_endpoint" {
  value = module.database.db_endpoint
}
