locals {
  name_prefix = substr("${terraform.workspace}-${var.project}-${var.environment}", 0, 32)
  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_dynamodb_table" "job_seeker_profiles" {
  name         = "${local.name_prefix}-job-seeker-profiles"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "job_seeker_id"

  attribute {
    name = "job_seeker_id"
    type = "S"
  }

  tags = local.tags
}

resource "aws_dynamodb_table" "job_poster_profiles" {
  name         = "${local.name_prefix}-job-poster-profiles"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "job_poster_id"

  attribute {
    name = "job_poster_id"
    type = "S"
  }

  tags = local.tags
}

resource "aws_dynamodb_table" "job_posts" {
  name         = "${local.name_prefix}-job-posts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "job_post_id"

  attribute {
    name = "job_post_id"
    type = "S"
  }

  attribute {
    name = "job_poster_id"
    type = "S"
  }

  global_secondary_index {
    name            = "job_poster_id_index"
    hash_key        = "job_poster_id"
    projection_type = "ALL"
  }

  tags = local.tags
}

resource "aws_dynamodb_table" "job_post_interests" {
  name         = "${local.name_prefix}-job-post-interests"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "job_post_id"
  range_key    = "job_seeker_id"

  attribute {
    name = "job_post_id"
    type = "S"
  }

  attribute {
    name = "job_seeker_id"
    type = "S"
  }

  global_secondary_index {
    name            = "job_seeker_id_index"
    hash_key        = "job_seeker_id"
    range_key       = "job_post_id"
    projection_type = "ALL"
  }

  tags = local.tags
}

resource "aws_dynamodb_table" "job_post_allocations" {
  name         = "${local.name_prefix}-job-post-allocations"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "job_post_id"
  range_key    = "job_seeker_id"

  attribute {
    name = "job_post_id"
    type = "S"
  }

  attribute {
    name = "job_seeker_id"
    type = "S"
  }

  attribute {
    name = "job_poster_id"
    type = "S"
  }

  global_secondary_index {
    name            = "job_seeker_id_index"
    hash_key        = "job_seeker_id"
    range_key       = "job_post_id"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "job_poster_id_index"
    hash_key        = "job_poster_id"
    range_key       = "job_post_id"
    projection_type = "ALL"
  }

  tags = local.tags
}

resource "aws_dynamodb_table" "job_ratings" {
  name         = "${local.name_prefix}-job-ratings"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "job_post_id"
  range_key    = "rating_key"

  attribute {
    name = "job_post_id"
    type = "S"
  }

  attribute {
    name = "rating_key"
    type = "S"
  }

  attribute {
    name = "job_seeker_id"
    type = "S"
  }

  global_secondary_index {
    name            = "job_seeker_id_index"
    hash_key        = "job_seeker_id"
    range_key       = "job_post_id"
    projection_type = "ALL"
  }

  tags = local.tags
}
