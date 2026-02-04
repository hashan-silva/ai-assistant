# Terraform (AWS Infrastructure)

Terraform modules define the complete AWS runtime for this chat-agent stack.

## What it provisions

- Network (VPC + public subnets)
- ECS Fargate services (backend + Ollama)
- ALB for backend API exposure
- Cognito user pool and client
- Frontend hosting (S3 + CloudFront)
- IAM deployment permissions

## Usage

```bash
terraform init
terraform plan
```

Use CI/CD (`terraform-deployment.yml`) for apply in shared environments.

## Important outputs

- `alb_dns_name`
- `cognito_user_pool_id`
- `cognito_user_pool_client_id`
- `frontend_bucket_name`
- `frontend_cloudfront_distribution_id`
