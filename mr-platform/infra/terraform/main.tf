# ITER MR Platform - Cloud landing zone baseline (AWS)
#
# This is a starting-point IaC skeleton matching Sprint 1 (EPIC 1: Cloud &
# DevOps Foundation) from the delivery plan: a VPC, an EKS cluster for the
# backend microservices, an RDS Postgres instance for OLTP data, and an S3
# bucket for attachments/media. It has NOT been run against a real AWS
# account - review, adjust CIDR ranges/instance sizes for your environment,
# and run `terraform plan` before ever applying.

terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Recommended: configure a remote backend (S3 + DynamoDB lock table)
  # backend "s3" {
  #   bucket         = "iter-mr-platform-tfstate"
  #   key            = "landing-zone/terraform.tfstate"
  #   region         = "ap-south-1"
  #   dynamodb_table = "iter-mr-platform-tf-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.project_name}-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway   = true
  single_nat_gateway   = var.environment != "production"
  enable_dns_hostnames = true

  tags = local.common_tags
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "${var.project_name}-${var.environment}"
  cluster_version = "1.29"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    default = {
      min_size       = var.environment == "production" ? 3 : 1
      max_size       = var.environment == "production" ? 10 : 3
      desired_size   = var.environment == "production" ? 3 : 1
      instance_types = ["m6i.large"]
    }
  }

  tags = local.common_tags
}

resource "aws_db_subnet_group" "this" {
  name       = "${var.project_name}-db-subnets"
  subnet_ids = module.vpc.private_subnets
  tags       = local.common_tags
}

resource "aws_db_instance" "oltp" {
  identifier     = "${var.project_name}-${var.environment}-db"
  engine         = "postgres"
  engine_version = "16"
  instance_class = var.environment == "production" ? "db.r6g.large" : "db.t4g.medium"

  allocated_storage     = 100
  max_allocated_storage = 500
  storage_encrypted     = true

  db_name  = "mrplatform"
  username = var.db_username
  password = var.db_password # inject via TF_VAR / secrets manager, never commit

  db_subnet_group_name   = aws_db_subnet_group.this.name
  multi_az                = var.environment == "production"
  backup_retention_period = 7
  deletion_protection     = var.environment == "production"

  tags = local.common_tags
}

resource "aws_s3_bucket" "attachments" {
  bucket = "${var.project_name}-${var.environment}-attachments"
  tags   = local.common_tags
}

resource "aws_s3_bucket_server_side_encryption_configuration" "attachments" {
  bucket = aws_s3_bucket.attachments.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
