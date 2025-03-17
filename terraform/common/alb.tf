resource "aws_alb" "shraga_alb" {
  name            = "shraga-load-balancer"
  internal        = var.alb_public == true ? false : true
  subnets         = var.alb_subnets_ids
  security_groups = [aws_security_group.shraga_alb.id]
  idle_timeout    = 4000
}

resource "aws_alb_target_group" "shraga_alb_tg" {
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
    path                = "/"
    unhealthy_threshold = "2"
  }
}

# TODO: Do we need http ? lets enforce https always 
resource "aws_alb_listener" "http" {
  load_balancer_arn = aws_alb.shraga_alb.id
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.shraga_alb_tg.id
    type             = "forward"
  }
}

data "aws_acm_certificate" "cert" {
  domain   = var.elb_cert_domain
  statuses = ["ISSUED"]
}

resource "aws_alb_listener" "https" {
  load_balancer_arn = aws_alb.shraga_alb.id
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = data.aws_acm_certificate.cert.arn
  default_action {
    target_group_arn = aws_alb_target_group.shraga_alb_tg.id
    type             = "forward"
  }
}


