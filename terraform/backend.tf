terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "hashan-silva"

    workspaces {
      prefix = "helpclub-"
    }
  }
}
