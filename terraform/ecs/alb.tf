locals {
  should_create_alb = var.alb_tg_arn == null ? true : false
}

resource "aws_alb" "shraga_alb" {
  count           = local.should_create_alb ? 1 : 0
  name            = "shraga-load-balancer"
  internal        = var.alb_public == true ? false : true
  subnets         = var.alb_subnets_ids
  security_groups = [aws_security_group.shraga_alb[0].id]
  idle_timeout    = 4000
}

resource "aws_alb_target_group" "shraga_alb_tg" {
  count       = local.should_create_alb ? 1 : 0
  name        = "shraga-alb-target-group"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    healthy_threshold   = "3"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "3"
    path                = "/healthz"
    unhealthy_threshold = "2"
  }
}

resource "aws_alb_listener" "http" {
  count             = local.should_create_alb ? 1 : 0
  load_balancer_arn = aws_alb.shraga_alb[0].id
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.shraga_alb_tg[0].id
    type             = "forward"
  }
}

data "aws_acm_certificate" "cert" {
  count    = local.should_create_alb ? 1 : 0
  domain   = var.alb_cert_domain
  statuses = ["ISSUED"]
}

resource "aws_alb_listener" "https" {
  count             = local.should_create_alb ? 1 : 0
  load_balancer_arn = aws_alb.shraga_alb[0].id
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = data.aws_acm_certificate.cert[0].arn
  default_action {
    target_group_arn = aws_alb_target_group.shraga_alb_tg[0].id
    type             = "forward"
  }
}


