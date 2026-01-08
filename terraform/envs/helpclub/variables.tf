variable "project" {
  type    = string
  default = "helpclub"
}

variable "environment" {
  type    = string
  default = "helpclub"
}

variable "tenancy_ocid" {
  type = string
}

variable "user_ocid" {
  type = string
}

variable "fingerprint" {
  type = string
}

variable "private_key_path" {
  type = string
}

variable "region" {
  type    = string
  default = "eu-stockholm-1"
}

variable "compartment_ocid" {
  type = string
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

variable "instance_shape" {
  type    = string
  default = "VM.Standard.E4.Flex"
}

variable "vcn_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "subnet_cidr" {
  type    = string
  default = "10.0.2.0/24"
}
