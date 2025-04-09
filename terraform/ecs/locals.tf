locals {
  should_create_alb                     = var.alb_tg_arn == null
  should_create_ecs_task_execution_role = var.ecs_task_execution_role_arn == null
  should_create_ecs_security_group      = var.ecs_sg_id == null

  should_create_cw_log_group = var.cw_log_group_name != null
}
