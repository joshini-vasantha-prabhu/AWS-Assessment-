# 🛠️ CI/CD Pipeline with Jenkins + Docker + Node.js

Welcome to the **CI/CD Jenkins Project**! This task demonstrates a classic DevOps setup using:

- 🧪 Jenkins for continuous integration
- 🐳 Docker to containerize a Node.js app
- 🔄 Automating build → test → image creation → container run

## 📁 Folder Structure
```
ci-cd-jenkins/
├── app/
│   ├── app.js
│   ├── package.json
│   └── index.html
├── Dockerfile

````

## 🚀 Project Goal

Set up a **local Jenkins pipeline** that:

1. ✅ Clones a Node.js app from GitHub
2. 🔧 Installs dependencies
3. 🧪 Runs unit tests
4. 🐳 Builds a Docker image
5. ▶️ Runs the container

## ⚙️ Prerequisites

Before running this, make sure you have:

- ✅ Docker installed (`docker --version`)
- ✅ Jenkins running in Docker
- ✅ GitHub repository cloned
- ✅ Your app inside `ci-cd-jenkins/app/`
- ✅ Jenkins Docker container has Docker CLI access (`/var/run/docker.sock`)


## 🧰 Step-by-Step Setup

### 🐳 Step 1: Run Jenkins in Docker

```bash
docker run -d \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --name jenkins \
  jenkins/jenkins:lts
````

---

### 🔑 Step 2: Get Jenkins Initial Password

```bash
docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Go to [http://localhost:8080](http://localhost:8080) and paste the password.

---

### 🔌 Step 3: Install Required Plugins

Install these:

* Git
* Docker
* NodeJS (optional if system-wide)

---

### 👷 Step 4: Create Freestyle Jenkins Job

1. Go to **New Item** → *Freestyle Project*
2. Name it: `ci-cd-jenkins-docker-project`
3. Under **Source Code Management** → Git:

   * URL: `https://github.com/<your-username>/AWS-Assessment-.git`
   * Branch: `main`
4. Under **Build Steps** → *Execute Shell*:

   ```bash
   cd ci-cd-jenkins/app
   npm install
   npm test
   cd ../../
   docker rm -f jenkins-app || true
   docker build -t jenkins-app .
   docker run -d -p 3000:3000 --name jenkins-app jenkins-app
   ```

---

## 🧪 Testing the Pipeline

* ✅ Push code changes to GitHub
* 🔄 Jenkins will auto-trigger (if configured with a webhook)
* 🧪 Tests will run
* 🐳 Docker image will be built and run
* 🌐 Access the app: [http://localhost:3000](http://localhost:3000)

---

## 🐞 Troubleshooting

* ❌ **Port already allocated?**

  ```bash
  docker stop $(docker ps -q)
  ```
* ❌ **Permission denied errors inside Jenkins?**

  * Use `USER root` in Jenkins Dockerfile
* ❌ **Node/NPM not found in Jenkins?**

  * Install Node.js manually inside Jenkins container or use Jenkins NodeJS plugin

---

## ✅ Success Criteria

* Jenkins job completes successfully
* Docker image is built
* App is accessible on `localhost:3000`
* Code changes auto-trigger rebuilds (optional via webhook)

---

## 🎉 That's It!
