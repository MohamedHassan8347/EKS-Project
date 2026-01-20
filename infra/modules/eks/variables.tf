variable "cluster_name" { type = string }
variable "cluster_version" { type = string }

variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }

variable "instance_types" { type = list(string) }
variable "min_size" { type = number }
variable "max_size" { type = number }
variable "desired_size" { type = number }

variable "admin_principal_arn" { type = string }

variable "tags" { type = map(string) }
