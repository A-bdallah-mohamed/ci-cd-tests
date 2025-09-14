provider "aws" {
    region = "eu-central-1"
}


data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}
resource "aws_security_group" "Abdallah_security_group" {
  name = "Abdallah-security_group"
  description = "Allow HTTP and SSH"
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
}

ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["105.196.225.45/32"]
}


egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
}
}

resource "aws_instance" "Guess_The_Country_Instances" {
  count = 5
  ami =  "ami-0a116fa7c861dd5f9"
  instance_type = "t3.micro"
  key_name = "apachekeypair"

subnet_id = data.aws_subnets.default.ids[count.index % length(data.aws_subnets.default.ids)]


  vpc_security_group_ids = [aws_security_group.Abdallah_security_group.id]
tags = {
    name = "GuessTheCountry-Instance-${count.index + 1}"
}
}
output "instance_public_ips" {
  value = aws_instance.Guess_The_Country_Instances[*].public_ip
  
}
