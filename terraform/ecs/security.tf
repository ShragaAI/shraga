data "aws_vpc" "selected" {
  id = var.vpc_id
}

resource "aws_security_group" "shraga_alb" {
  count       = local.should_create_alb ? 1 : 0
  name        = "shraga-alb-security-group"
  description = "Controls access to the ALB"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.alb_public == true ? ["0.0.0.0/0"] : [data.aws_vpc.selected.cidr_block]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = var.alb_public == true ? ["0.0.0.0/0"] : [data.aws_vpc.selected.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "shraga_ecs_tasks" {
  name        = "shraga-ecs-tasks-security-group"
  description = "Allows inbound access from the ALB host only"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [local.should_create_alb ? aws_security_group.shraga_alb.id : var.var.alb_sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
