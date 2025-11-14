resource "aws_db_instance" "oracle" {
  identifier         = "${var.project}-${var.environment}-oracle"
  engine             = "oracle-se2"
  instance_class     = "db.m6i.large"
  allocated_storage  = 100
  username           = "helpclub_app"
  password           = var.db_password
  skip_final_snapshot = true
}
