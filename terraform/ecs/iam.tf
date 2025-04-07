resource "aws_iam_role" "ecs_task_execution_role" {
  count = local.should_create_ecs_task_execution_role ? 1 : 0
  name  = "ecsShragaTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  count      = local.should_create_ecs_task_execution_role ? 1 : 0
  role       = aws_iam_role.ecs_task_execution_role[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_task_execution_role_cw_logs" {
  count = local.should_create_cw_log_group ? 1 : 0
  name  = "cloudwatch-logs"
  role  = aws_iam_role.ecs_task_execution_role[0].name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = [
          "${aws_cloudwatch_log_group.shraga_log_group[0].arn}:*"
        ]
      }
    ]
  })
}
