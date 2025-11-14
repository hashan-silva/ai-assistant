terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }
  backend "s3" {}
}

provider "aws" {
  region = var.aws_region
}

module "network" {
  source      = "../../modules/network"
  project     = var.project
  environment = var.environment
}

module "compute" {
  source      = "../../modules/compute"
  project     = var.project
  environment = var.environment
  service_count = 2
}

module "database" {
  source      = "../../modules/database"
  project     = var.project
  environment = var.environment
  db_password = var.db_password
}
