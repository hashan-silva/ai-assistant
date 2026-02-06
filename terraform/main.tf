module "network" {
  source              = "./modules/network"
  project             = var.project
  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
}

module "auth" {
  source      = "./modules/auth"
  project     = var.project
  environment = var.environment
}

module "compute" {
  source        = "./modules/compute"
  project       = var.project
  environment   = var.environment
  aws_region    = var.aws_region
  cognito_region = var.aws_region
  cognito_user_pool_client_id = module.auth.user_pool_client_id
  cognito_user_pool_id = module.auth.user_pool_id
  vpc_id        = module.network.vpc_id
  subnet_ids    = module.network.public_subnet_ids
  backend_image = var.backend_image
  ollama_image  = var.ollama_image
  task_cpu      = var.task_cpu
  task_memory   = var.task_memory
  desired_count = var.desired_count
}

module "frontend" {
  source      = "./modules/frontend"
  project     = var.project
  environment = var.environment
  alb_dns_name = module.compute.alb_dns_name
}

module "iam" {
  source                    = "./modules/iam"
  project                   = var.project
  environment               = var.environment
  ecs_cluster_name          = module.compute.cluster_name
  ecs_service_name          = module.compute.service_name
  task_execution_role_arn   = module.compute.task_execution_role_arn
  frontend_bucket_arn       = module.frontend.bucket_arn
  frontend_distribution_arn = module.frontend.cloudfront_distribution_arn
}
