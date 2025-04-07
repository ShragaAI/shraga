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
  default     = null
}

variable "alb_cert_domain" {
  description = "Domain used for SSL termination on ALB"
  type        = string
  default     = null
}

variable "alb_public" {
  description = "Make ALB publicly available"
  type        = bool
  default     = false
}

variable "alb_tg_arn" {
  description = "ARN of the target group"
  type        = string
  default     = null

  validation {
    condition     = (var.alb_tg_arn != null && var.alb_sg_id != null) || (var.alb_subnets_ids != null && var.alb_cert_domain != null)
    error_message = "ALB target group ARN and security group ID are required when `var.alb_subnets_ids` or `var.alb_cert_domain` are not set"
  }
}

variable "alb_sg_id" {
  description = "ID of the ALB's security group"
  type        = string
  default     = null
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

variable "ecs_task_execution_role_arn" {
  description = "IAM role for ECS task execution"
  type        = string
  default     = null
}

variable "ecs_sg_id" {
  description = "ID of the ECS service security group"
  type        = string
  default     = null
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
