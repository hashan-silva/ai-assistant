variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "tenancy_ocid" {
  type = string
}

variable "compartment_id" {
  type = string
}


variable "subnet_id" {
  type = string
}

variable "instance_shape" {
  type    = string
  default = "VM.Standard.E4.Flex"
}

variable "ssh_public_key" {
  type = string
}

variable "frontend_image" {
  type = string
}

variable "backend_image" {
  type = string
}

variable "ollama_image" {
  type    = string
  default = "ollama/ollama:latest"
}
