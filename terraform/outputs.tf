output "vcn_id" {
  value = module.network.vcn_id
}

output "subnet_id" {
  value = module.network.subnet_id
}

output "instance_public_ip" {
  value = module.compute.public_ip
}
