output "shraga-task-sg" {
    value = aws_security_group.shraga_ecs_tasks.id
}

output "shraga-ip" {
  value = aws_alb.shraga_alb.dns_name
}