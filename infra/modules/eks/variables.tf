variable "cluster_name" { type = string }
variable "cluster_version" { type = string }

variable "github_actions_role_arn" {
  description = "IAM role ARN used by GitHub Actions (OIDC) to manage the cluster"
  type        = string
}

variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }

variable "instance_types" { type = list(string) }
variable "min_size" { type = number }
variable "max_size" { type = number }
variable "desired_size" { type = number }

variable "admin_principal_arn" { type = string }

variable "tags" { type = map(string) }
