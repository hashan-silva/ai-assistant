data "oci_core_images" "oracle_linux" {
  compartment_id           = var.compartment_id
  operating_system         = "Oracle Linux"
  operating_system_version = "8"
  shape                    = var.instance_shape
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

data "oci_identity_availability_domains" "this" {
  compartment_id = var.tenancy_ocid
}

resource "oci_core_instance" "this" {
  compartment_id      = var.compartment_id
  availability_domain = data.oci_identity_availability_domains.this.availability_domains[0].name
  display_name        = "${var.project}-${var.environment}-app"
  shape               = var.instance_shape

  create_vnic_details {
    subnet_id        = var.subnet_id
    assign_public_ip = true
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data = base64encode(templatefile("${path.module}/user_data.sh.tftpl", {
      backend_image  = var.backend_image
      frontend_image = var.frontend_image
      ollama_image   = var.ollama_image
    }))
  }

  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.oracle_linux.images[0].id
  }
}

data "oci_core_vnic_attachments" "this" {
  compartment_id = var.compartment_id
  instance_id    = oci_core_instance.this.id
}

data "oci_core_vnic" "this" {
  vnic_id = data.oci_core_vnic_attachments.this.vnic_attachments[0].vnic_id
}
