# Terraform Deployment

Reusable modules for networking, compute, Oracle database, and CI/CD orchestration. Environment-specific stacks live under `envs/`.

## Usage

```bash
cd terraform/envs/dev
terraform init
terraform plan -var-file=dev.tfvars
```

Configure backend state (e.g., remote object storage) within each environment folder or via CLI arguments.
