module "network" {
  source         = "./modules/network"
  project        = var.project
  environment    = var.environment
  compartment_id = var.compartment_ocid
  vcn_cidr       = var.vcn_cidr
  subnet_cidr    = var.subnet_cidr
}

module "compute" {
  source         = "./modules/compute"
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
