aws_region      = "eu-north-1"
cluster_name    = "eks-portfolio-dev"
cluster_version = "1.29"

vpc_name = "eks-portfolio-dev"
vpc_cidr = "10.20.0.0/16"

azs = ["eu-north-1a", "eu-north-1b"]

public_subnets  = ["10.20.1.0/24", "10.20.2.0/24"]
private_subnets = ["10.20.11.0/24", "10.20.12.0/24"]

# COST WARNING: NAT Gateway costs money while running
enable_nat_gateway = true
single_nat_gateway = true

instance_types = ["t3.small"]
min_size       = 1
max_size       = 2
desired_size   = 1

admin_principal_arn     = "arn:aws:iam::057773388128:user/adminnew"
github_actions_role_arn = "arn:aws:iam::057773388128:role/github-actions-eks-terraform"

tags = {
  Project     = "EKS-Project"
  Environment = "dev"
}
