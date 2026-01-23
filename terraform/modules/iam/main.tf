locals {
  name_prefix = substr("${terraform.workspace}-${var.project}-${var.environment}", 0, 32)
}

resource "aws_iam_user" "deploy" {
  name = "${local.name_prefix}-deploy"
}

resource "aws_iam_access_key" "deploy" {
  user = aws_iam_user.deploy.name
}

data "aws_region" "current" {}

data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "deploy" {
  statement {
    effect = "Allow"
    actions = [
      "ecs:DescribeServices",
      "ecs:UpdateService"
    ]
    resources = [
      "arn:aws:ecs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:service/${var.ecs_cluster_name}/${var.ecs_service_name}"
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "ecs:DescribeTasks",
      "ecs:ListTasks"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "ecs:DescribeTaskDefinition",
      "ecs:RegisterTaskDefinition"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "iam:PassRole"
    ]
    resources = [
      var.task_execution_role_arn
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "dynamodb:CreateTable",
      "dynamodb:DeleteTable",
      "dynamodb:DescribeTable",
      "dynamodb:TagResource",
      "dynamodb:UntagResource",
      "dynamodb:UpdateTable"
    ]
    resources = var.dynamodb_table_arns
  }

  statement {
    effect = "Allow"
    actions = [
      "dynamodb:ListTables"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "s3:CreateBucket"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "s3:ListBucket"
    ]
    resources = [var.frontend_bucket_arn]
  }

  statement {
    effect = "Allow"
    actions = [
      "s3:DeleteBucket",
      "s3:GetObject",
      "s3:GetBucketLocation",
      "s3:PutBucketOwnershipControls",
      "s3:PutBucketPublicAccessBlock",
      "s3:PutBucketVersioning",
      "s3:PutEncryptionConfiguration",
      "s3:PutBucketPolicy",
      "s3:PutObject",
      "s3:DeleteObject"
    ]
    resources = [
      var.frontend_bucket_arn,
      "${var.frontend_bucket_arn}/*"
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "cloudfront:CreateDistribution",
      "cloudfront:CreateOriginAccessControl"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "cloudfront:UpdateDistribution",
      "cloudfront:GetDistribution",
      "cloudfront:DeleteDistribution",
      "cloudfront:GetOriginAccessControl",
      "cloudfront:UpdateOriginAccessControl",
      "cloudfront:DeleteOriginAccessControl",
      "cloudfront:CreateInvalidation"
    ]
    resources = [
      var.frontend_distribution_arn,
      "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/*",
      "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:origin-access-control/*"
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "cloudfront:ListDistributions",
      "cloudfront:ListOriginAccessControls"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "deploy" {
  name   = "${local.name_prefix}-deploy"
  policy = data.aws_iam_policy_document.deploy.json
}

resource "aws_iam_user_policy_attachment" "deploy" {
  user       = aws_iam_user.deploy.name
  policy_arn = aws_iam_policy.deploy.arn
}
