resource "aws_s3_bucket" "shraga_bucket" {
  bucket = var.s3_bucket
}

resource "aws_s3_object" "object" {
  bucket = aws_s3_bucket.shraga_bucket.id
  key    = "config.yaml"
  source = var.config_file_path

  etag = filemd5(var.config_file_path)
}
