output "table_arns" {
  value = [
    aws_dynamodb_table.job_seeker_profiles.arn,
    aws_dynamodb_table.job_poster_profiles.arn,
    aws_dynamodb_table.job_posts.arn,
    aws_dynamodb_table.job_post_interests.arn,
    aws_dynamodb_table.job_post_allocations.arn,
    aws_dynamodb_table.job_ratings.arn
  ]
}

output "table_names" {
  value = [
    aws_dynamodb_table.job_seeker_profiles.name,
    aws_dynamodb_table.job_poster_profiles.name,
    aws_dynamodb_table.job_posts.name,
    aws_dynamodb_table.job_post_interests.name,
    aws_dynamodb_table.job_post_allocations.name,
    aws_dynamodb_table.job_ratings.name
  ]
}

output "table_name_map" {
  value = {
    job_seeker_profiles  = aws_dynamodb_table.job_seeker_profiles.name
    job_poster_profiles  = aws_dynamodb_table.job_poster_profiles.name
    job_posts            = aws_dynamodb_table.job_posts.name
    job_post_interests   = aws_dynamodb_table.job_post_interests.name
    job_post_allocations = aws_dynamodb_table.job_post_allocations.name
    job_ratings          = aws_dynamodb_table.job_ratings.name
  }
}
