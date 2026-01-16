module "network" {
  source              = "./modules/network"
  project             = var.project
  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
}

module "database" {
  source      = "./modules/database"
  project     = var.project
  environment = var.environment
}

module "auth" {
  source      = "./modules/auth"
  project     = var.project
  environment = var.environment
}

module "compute" {
  source         = "./modules/compute"
  project        = var.project
  environment    = var.environment
  aws_region     = var.aws_region
  vpc_id         = module.network.vpc_id
  subnet_ids     = module.network.public_subnet_ids
  frontend_image = var.frontend_image
  backend_image  = var.backend_image
  ollama_image   = var.ollama_image
  task_cpu       = var.task_cpu
  task_memory    = var.task_memory
  desired_count  = var.desired_count
  dynamodb_table_arns = module.database.table_arns
  dynamodb_table_names = module.database.table_name_map
  cognito_user_pool_client_id = module.auth.user_pool_client_id
  cognito_user_pool_id = module.auth.user_pool_id
}

module "iam" {
  source                  = "./modules/iam"
  project                 = var.project
  environment             = var.environment
  ecs_cluster_name        = module.compute.cluster_name
  ecs_service_name        = module.compute.service_name
  task_execution_role_arn = module.compute.task_execution_role_arn
  dynamodb_table_arns     = module.database.table_arns
}
