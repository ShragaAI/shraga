output "shraga_ecr_repository_url" {
  value = aws_ecr_repository.shraga_repo.repository_url
}

output "shraga_init_ecr_repository_url" {
  value = aws_ecr_repository.shraga_init_repo.repository_url
}

output "shraga_s3_bucket_id" {
  value = aws_s3_bucket.shraga_bucket.id
}

output "shraga_ecs_cluster_arn" {
  value = aws_ecs_cluster.shraga_cluster.arn
}
