resource "oci_database_autonomous_database" "this" {
  compartment_id           = var.compartment_id
  display_name             = "${var.project}-${var.environment}-adb"
  db_name                  = var.db_name
  cpu_core_count           = var.cpu_core_count
  data_storage_size_in_tbs = var.data_storage_size_in_tbs
  admin_password           = var.db_password
  db_workload              = "OLTP"
  is_free_tier             = var.is_free_tier
  is_auto_scaling_enabled  = true
}
