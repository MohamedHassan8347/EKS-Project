terraform {
  backend "s3" {
    bucket         = "mh-ecs-project-tfstate"
    key            = "eks/envs/dev/terraform.tfstate"
    region         = "eu-north-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
