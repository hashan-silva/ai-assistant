resource "oci_devops_project" "this" {
  compartment_id = var.compartment_id
  name           = "${var.project}-${var.environment}-devops"
  description    = "Helpclub CI/CD project for ${var.environment}"
}
