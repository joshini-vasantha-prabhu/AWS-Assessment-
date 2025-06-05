# 🔁 CI/CD with GitHub Actions + Docker + Kubernetes (Minikube)

This task simulates a modern DevOps CI/CD pipeline using **GitHub Actions**, **Docker**, and **Kubernetes (Minikube)** — entirely on your local system 🧑‍💻


## 📁 Folder Structure

```

github\_actions\_cicd/
├── app.js
├── Dockerfile
├── index.html
├── package.json
.github/
└── workflows/
└── ci-cd.yaml

````

## 🎯 Objective

1. ✅ Trigger CI/CD pipeline from GitHub
2. 🧪 Run tests
3. 🐳 Build and push Docker image to DockerHub (or local)
4. ☸️ Deploy automatically to Minikube


## ⚙️ Prerequisites

| Tool            | Check with                |
|------------------|----------------------------|
| GitHub Repo      | ✅ (e.g. `AWS-Assessment-`) |
| Docker           | `docker --version`         |
| Minikube         | `minikube status`          |
| kubectl          | `kubectl version --client` |
| DockerHub Account| ✅ (e.g. `joshini1212`)     |


## 🛠️ Step-by-Step Setup


### 📦 Step 1: Node.js App

`github_actions_cicd/app.js`

```js
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  fs.readFile('index.html', (err, html) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading index.html");
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(html);
    }
  });
}).listen(3000, () => console.log("🚀 App running on port 3000"));
````

### 🐳 Step 2: Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```


### 🧪 Step 3: GitHub Actions Workflow

📁 `.github/workflows/ci-cd.yaml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install
      working-directory: github_actions_cicd

    - name: Run tests
      run: npm test
      working-directory: github_actions_cicd

    - name: Log in to DockerHub
      run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin

    - name: Build and push Docker image
      run: |
        docker build -t joshini1212/github-cicd:latest github_actions_cicd
        docker push joshini1212/github-cicd:latest

    - name: Set up kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'latest'

    - name: Deploy to Minikube
      run: |
        kubectl apply -f kubernetes_assessment/deployment.yaml
        kubectl apply -f kubernetes_assessment/service.yaml
```


## 🔐 Step 4: Add GitHub Secrets

Go to:
**GitHub Repo → Settings → Secrets → Actions**

| Secret Name       | Value                       |
| ----------------- | --------------------------- |
| `DOCKER_USERNAME` | your DockerHub ID           |
| `DOCKER_PASSWORD` | your DockerHub PAT/password |


## ☸️ Step 5: Kubernetes Manifests (Already done)

Use `deployment.yaml` and `service.yaml` inside `kubernetes_assessment/` to deploy to Minikube.


## ✅ What Happens on Push

1. GitHub triggers the pipeline
2. Your app is:

   * 🧪 Tested
   * 🐳 Dockerized
   * ⬆️ Pushed to DockerHub
   * ☸️ Deployed into Minikube

## 🔍 Verify

* Run: `kubectl get pods`
* Run: `kubectl get svc`
* Visit:

  ```url
  http://<minikube-ip>:<nodePort>
  ```

## 🎉 Success Criteria

✅ GitHub Actions builds & tests
✅ Docker image pushed to DockerHub
✅ App deployed to Kubernetes
✅ Accessible via Minikube IP


## 📌 Pro Tips

* Use `minikube ip` to get your Minikube address
* Use a NodePort service to expose externally
* Keep your GitHub Actions **idempotent** and secrets secure 🔒

> 🎯 Git pushes now become production deployments — welcome to real DevOps!
