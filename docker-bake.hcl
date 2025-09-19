group "default" {
  targets = ["frontend", "backend"]
}

target "frontend" {
  context = "./frontend"
  dockerfile = "Dockerfile"
  tags = ["ghcr.io/ayrus15/mind-guard/frontend:latest"]
}

target "backend" {
  context = "./backend"
  dockerfile = "Dockerfile"
  tags = ["ghcr.io/ayrus15/mind-guard/backend:latest"]
}

target "all" {
  targets = ["frontend", "backend"]
}