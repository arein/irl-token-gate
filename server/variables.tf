# Input variable definitions

variable "aws_region" {
  description = "AWS region for all resources."

  type    = string
  default = "us-east-1"
}

variable "PRIVATE_KEY_PW" {
  # TF_VAR_PRIVATE_KEY_PW in `.env` 
  type = string
}

variable "app_name" {
  # Define via
  # TF_VAR_app_name in `.env` 
  type = string
}