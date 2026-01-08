output "instance_id" {
  value = oci_core_instance.this.id
}

output "public_ip" {
  value = data.oci_core_vnic.this.public_ip_address
}
