variable "aws_region" {
  description = "AWS region"
}

variable "vpc_id" {
  description = "VPC ID"
}

variable "s3_bucket" {
  description = "S3 bucket for assets storage"
}

variable "ecs_subnets_ids" {
  description = "Subnets used by AWS fargete to deploy conatiner"
  type        = list(string)
}

variable "alb_subnets_ids" {
  description = "Subnets used for ALB deployment, if var.alb_public == false set private subnets !!!"
  type        = list(string)
}

variable "bastion_sg_id" {
  description = "Bastion Security Group ID"
}

variable "shraga_tag" {
  default = "latest"
}

variable "elb_cert_domain" {
  description = "Domain used for ssl termination on ALB"
}

variable "alb_public" {
  description = "Make ALB public available "
  type        = bool
  default     = false
}

variable "app_config" {
  description = "Location in file system to app config "
  default     = "/vol1/config.yaml"
}

variable "config_file_path" {
  description = "Absolute path for the Shraga config.yaml file"
}

variable "task_replicas" {
  default = 1
}