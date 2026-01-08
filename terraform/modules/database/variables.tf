variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "compartment_id" {
  type = string
}

variable "db_name" {
  type    = string
  default = "helpclub"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "cpu_core_count" {
  type    = number
  default = 1
}

variable "data_storage_size_in_tbs" {
  type    = number
  default = 1
}

variable "is_free_tier" {
  type    = bool
  default = true
}
