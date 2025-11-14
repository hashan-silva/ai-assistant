resource "aws_codepipeline" "this" {
  name = "${var.project}-${var.environment}-pipeline"
  role_arn = "arn:aws:iam::123456789012:role/dummy"

  artifact_store {
    location = "example-bucket"
    type     = "S3"
  }

  stage {
    name = "Source"
    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source"]
      configuration = {
        ConnectionArn    = "arn:aws:codestar-connections:region:acct:connection/dummy"
        FullRepositoryId = "helpclub/helpclub"
        BranchName       = "main"
      }
    }
  }
}
