output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "rds_endpoint" {
  value = aws_db_instance.oltp.endpoint
}

output "attachments_bucket" {
  value = aws_s3_bucket.attachments.bucket
}
