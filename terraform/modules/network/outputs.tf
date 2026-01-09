output "vpc_id" {
  value = aws_vpc.this.id
}

output "subnet_id" {
  value = aws_subnet.public[0].id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}
