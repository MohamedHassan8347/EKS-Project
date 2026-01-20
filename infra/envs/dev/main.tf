locals {
  name = "${var.project_name}-${var.env}"
  tags = {
    Project = var.project_name
    Env     = var.env
  }
}

module "vpc" {
  source = "../../modules/vpc"

  name            = local.name
  vpc_cidr        = var.vpc_cidr
  azs             = var.azs
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  enable_nat_gateway = var.enable_nat_gateway
  single_nat_gateway = var.single_nat_gateway

  tags = local.tags
}

module "eks" {
  source = "../../modules/eks"

  cluster_name       = local.name
  cluster_version    = var.cluster_version
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnets

  instance_types = var.instance_types
  min_size       = 1
  max_size       = 2
  desired_size   = 1

  admin_principal_arn = var.admin_principal_arn

  tags = local.tags
}
