variable "aws_region" { type = string }

variable "cluster_name" { type = string }
variable "cluster_version" { type = string }

# root variable name (we map this into module.vpc.name)
variable "vpc_name" { type = string }

variable "vpc_cidr" { type = string }
variable "azs" { type = list(string) }
variable "public_subnets" { type = list(string) }
variable "private_subnets" { type = list(string) }

variable "enable_nat_gateway" { type = bool }
variable "single_nat_gateway" { type = bool }

variable "instance_types" { type = list(string) }
variable "min_size" { type = number }
variable "max_size" { type = number }
variable "desired_size" { type = number }

variable "admin_principal_arn" { type = string }
variable "github_actions_role_arn" { type = string }

variable "tags" {
  type    = map(string)
  default = {}
}
