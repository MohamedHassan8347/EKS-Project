project_name = "eks-portfolio"
env          = "dev"
aws_region   = "eu-north-1"

vpc_cidr        = "10.20.0.0/16"
azs             = ["eu-north-1a", "eu-north-1b"]
public_subnets  = ["10.20.1.0/24", "10.20.2.0/24"]
private_subnets = ["10.20.11.0/24", "10.20.12.0/24"]

# ⚠️ NAT Gateway costs money, but it's brief-aligned (private nodes need outbound)
enable_nat_gateway = true
single_nat_gateway = true

cluster_version = "1.29"
instance_types  = ["t3.small"]

admin_principal_arn = "arn:aws:iam::057773388128:user/adminnew"
