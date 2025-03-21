variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "s3_bucket" {
  description = "S3 bucket for assets storage"
  type        = string
}

variable "ecs_subnets_ids" {
  description = "Subnets used by AWS Fargate to deploy container"
  type        = list(string)
}

variable "alb_subnets_ids" {
  description = "Subnets used for ALB deployment, if `var.alb_public == false` set private subnets"
  type        = list(string)
}

variable "alb_cert_domain" {
  description = "Domain used for SSL termination on ALB"
  type        = string
}

variable "alb_public" {
  description = "Make ALB publicly available"
  type        = bool
  default     = false
}

variable "app_config" {
  description = "Location in file system to app config"
  default     = "/vol1/config.yaml"
}

variable "config_file_path" {
  description = "Absolute path for the Shraga `config.yaml` file"
  type        = string
}

variable "ecs_task_role_arn" {
  description = "IAM role for ECS task"
  type        = string
}

variable "task_replicas" {
  default = 1
}

variable "task_cpu" {
  default = "1024"
}

variable "task_memory" {
  default = "2048"
}
