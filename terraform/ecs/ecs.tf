resource "aws_ecr_repository" "shraga_repo" {
  name = "shraga"
}

resource "aws_ecr_repository" "shraga_init_repo" {
  name = "shraga_init"
}

resource "aws_ecs_cluster" "shraga_cluster" {
  name = "shraga"
}

resource "aws_cloudwatch_log_group" "shraga_log_group" {
  count             = local.should_create_cw_log_group ? 1 : 0
  name              = var.cw_log_group_name
  retention_in_days = 3
}

resource "aws_ecs_task_definition" "shraga_app" {
  family                   = "shraga-app-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = local.should_create_ecs_task_execution_role ? aws_iam_role.ecs_task_execution_role[0].arn : var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_role_arn
  volume {
    name      = "conf-vol"
    host_path = ""
  }

  container_definitions = jsonencode([
    {
      name  = "shraga-app"
      image = "${aws_ecr_repository.shraga_repo.repository_url}:latest"
      environment = [
        {
          name  = "CONFIG_PATH"
          value = var.app_config
        }
      ]
      essential = true
      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
        }
      ]
      logConfiguration = local.should_create_cw_log_group ? {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.shraga_log_group[0].name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      } : null
      mountPoints = [{
        sourceVolume  = "conf-vol"
        containerPath = "/vol1"
      }]
      dependsOn = [
        {
          containerName = "shraga-init"
          condition     = "COMPLETE"
        }
      ]
    },
    {
      name      = "shraga-init"
      image     = "${aws_ecr_repository.shraga_init_repo.repository_url}:latest"
      essential = false
      environment = [
        {
          name  = "SOURCE_BUCKET"
          value = "${aws_s3_bucket.shraga_bucket.id}"
        },
        {
          name  = "DEST_VOL"
          value = "vol1"
        },
        {
          name  = "DEST_FILE"
          value = "config.yaml"
        }
      ]
      logConfiguration = local.should_create_cw_log_group ? {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.shraga_log_group[0].name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      } : null
      mountPoints = [{
        sourceVolume  = "conf-vol"
        containerPath = "/vol1"
        readOnly      = false
      }]
    }
  ])

  depends_on = [aws_s3_object.object]
}

resource "aws_ecs_service" "shraga_srv" {
  name            = "shraga-srv"
  cluster         = aws_ecs_cluster.shraga_cluster.id
  task_definition = aws_ecs_task_definition.shraga_app.arn
  desired_count   = var.task_replicas
  launch_type     = "FARGATE"

  force_new_deployment = true

  network_configuration {
    subnets          = var.ecs_subnets_ids
    assign_public_ip = false
    security_groups  = local.should_create_ecs_security_group ? [aws_security_group.shraga_ecs_tasks[0].id] : [var.ecs_sg_id]
  }

  load_balancer {
    target_group_arn = local.should_create_alb ? aws_alb_target_group.shraga_alb_tg[0].arn : var.alb_tg_arn
    container_name   = "shraga-app"
    container_port   = 8000
  }
}
