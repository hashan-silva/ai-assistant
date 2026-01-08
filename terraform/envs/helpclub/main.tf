terraform {
  required_version = ">= 1.6.0"
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.25"
    }
  }
  backend "remote" {
    organization = "helpclub"
    workspaces {
      name = "helpclub-main"
    }
  }
}

provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}

module "network" {
  source         = "../../modules/network"
  project        = var.project
  environment    = var.environment
  compartment_id = var.compartment_ocid
  vcn_cidr       = var.vcn_cidr
  subnet_cidr    = var.subnet_cidr
}

module "compute" {
  source         = "../../modules/compute"
  project        = var.project
  environment    = var.environment
  tenancy_ocid   = var.tenancy_ocid
  compartment_id = var.compartment_ocid
  subnet_id      = module.network.subnet_id
  instance_shape = var.instance_shape
  ssh_public_key = var.ssh_public_key
  frontend_image = var.frontend_image
  backend_image  = var.backend_image
  ollama_image   = var.ollama_image
}
