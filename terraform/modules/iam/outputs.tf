output "user_name" {
  value = aws_iam_user.deploy.name
}

output "access_key_id" {
  value = aws_iam_access_key.deploy.id
}

output "secret_access_key" {
  value     = aws_iam_access_key.deploy.secret
  sensitive = true
}
