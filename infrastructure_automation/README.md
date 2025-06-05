# 🛠️ Infrastructure Automation with Shell Script + Docker Compose

This task simulates real-world **DevOps automation** by provisioning an entire infrastructure stack locally using:

- 🐳 Docker Compose
- 📜 Shell script
- 💻 Services: Jenkins, Redis, Nginx, and a Node.js app


## 📁 Folder Structure

infrastructure\_automation/
├── docker-compose.yml
├── setup.sh
├── nginx/
│   └── default.conf
├── redis/
│   └── Dockerfile (optional)
├── jenkins/
│   └── Dockerfile
└── node-app/
├── app.js
├── Dockerfile
├── package.json
└── index.html

## 🎯 Objective

1. Automate infrastructure setup for multiple services
2. Run everything via a single `setup.sh` script
3. Use Docker Compose to orchestrate containers
4. Optionally include health checks and log rotation

## ⚙️ Services Used

| Service  | Purpose                       | Port     |
|----------|-------------------------------|----------|
| Jenkins  | CI Server                     | 8080     |
| Redis    | In-memory data store          | 6379     |
| Nginx    | Reverse proxy to app          | 80       |
| Node.js  | Sample app with index.html    | 3000     |

## 📦 Step-by-Step Setup

### ✅ Step 1: Jenkins Dockerfile

📁 `jenkins/Dockerfile`

```dockerfile
FROM jenkins/jenkins:lts
USER root
RUN apt-get update && apt-get install -y docker.io
````

### ✅ Step 2: Nginx Config

📁 `nginx/default.conf`

```nginx
server {
    listen 80;
    location / {
        proxy_pass http://node-app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### ✅ Step 3: Node.js App

📁 `node-app/app.js`

```js
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  fs.readFile('index.html', (err, html) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    }
  });
}).listen(3000, () => {
  console.log('🚀 Node app running on port 3000');
});
```

📁 `node-app/index.html`

```html
<!DOCTYPE html>
<html>
<head><title>DevOps Infra</title></head>
<body>
  <h1>🚀 Welcome to the DevOps Automation App!</h1>
  <p>With Jenkins, Redis, Nginx, and Docker Compose!</p>
</body>
</html>
```

📁 `node-app/package.json`

```json
{
  "name": "infra-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node app.js"
  }
}
```

📁 `node-app/Dockerfile`

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

### 🧩 Step 4: Docker Compose File

📁 `docker-compose.yml`

```yaml
version: '3.8'

services:
  jenkins:
    build: ./jenkins
    ports:
      - "8080:8080"
    volumes:
      - jenkins_home:/var/jenkins_home

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - node-app

  node-app:
    build: ./node-app
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  jenkins_home:
```

### ⚙️ Step 5: Automation Script

📁 `setup.sh`

```bash
#!/bin/bash

echo "🔧 Stopping existing containers..."
docker-compose down

echo "🚀 Building and starting infrastructure..."
docker-compose up --build -d

echo "✅ All services are up!"
```

Make it executable:

```bash
chmod +x setup.sh
```

### ▶️ Step 6: Run Everything

```bash
./setup.sh
```

✅ Services will spin up and run in the background.

## 🌐 Access Points

| URL                                            | Service             |
| ---------------------------------------------- | ------------------- |
| [http://localhost:80](http://localhost:80)     | Nginx → Node.js App |
| [http://localhost:8080](http://localhost:8080) | Jenkins             |
| redis\://localhost:6379                        | Redis               |


## ✅ Success Criteria

* Jenkins UI loads at port 8080
* Node.js app is accessible via Nginx on port 80
* Redis runs without errors
* Health checks are green ✅

## 🧠 What You Learned

* How to use Docker Compose to orchestrate multiple services
* How to write a shell script to automate infrastructure
* How to reverse proxy apps using Nginx
* How to structure DevOps infrastructure locally
