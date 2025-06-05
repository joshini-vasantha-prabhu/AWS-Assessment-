# 🚀 GitOps Workflow with Argo CD (Optional)

This task simulates a **GitOps-style deployment pipeline** using 🔁 **Argo CD**, which automatically syncs your Kubernetes manifests from GitHub into a local cluster (Minikube).


## 📁 Folder Structure

argo\_cd\_gitops/
├── node-app/
│   ├── app.js
│   ├── Dockerfile
│   ├── index.html
│   └── package.json
├── kubernetes/
│   ├── deployment.yaml
│   └── service.yaml


## 🎯 Objective

1. Create a simple Node.js app
2. Create Kubernetes manifests
3. Push them to GitHub
4. Install and configure **Argo CD**
5. Auto-deploy the app into **Minikube** using GitOps


## ⚙️ Prerequisites

Make sure these are installed:

| Tool         | Check with             |
|--------------|------------------------|
| 🐳 Docker     | `docker --version`     |
| ☸️ Minikube   | `minikube status`      |
| 🧪 kubectl   | `kubectl version`       |
| 🔁 Argo CD   | installed in Minikube or via `kubectl` |
| 🖥️ GitHub Repo | e.g., `AWS-Assessment-` repo |


## 🧰 Step-by-Step Setup


### ✅ Step 1: Build Node.js App

`node-app/app.js`

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

Build and push Docker image:

```bash
eval $(minikube docker-env)
docker build -t node-app:gitops ./node-app
```

---

### 📦 Step 2: Kubernetes Manifests

📁 `kubernetes/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: node-app
  template:
    metadata:
      labels:
        app: node-app
    spec:
      containers:
        - name: node-app
          image: node-app:gitops
          ports:
            - containerPort: 3000
```

📁 `kubernetes/service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: node-app-svc
spec:
  selector:
    app: node-app
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 31000
  type: NodePort
```

### 🔁 Step 3: Install Argo CD (Locally in Minikube)

```bash
kubectl create namespace argocd

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Port-forward Argo UI:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Access at:
👉 `https://localhost:8080`

Default login:

* Username: `admin`
* Password: run:

  ```bash
  kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d && echo
  ```

### 🔗 Step 4: Connect Argo CD to Your Git Repo

1. Login to Argo CD Web UI
2. Click **New App**
3. Fill in:

   * App Name: `node-app`
   * Repo URL: `https://github.com/<your-username>/AWS-Assessment-.git`
   * Path: `kubernetes_assessment` or `kubernetes/` (where your YAMLs are)
   * Cluster: `https://kubernetes.default.svc`
   * Namespace: `default`
4. Hit **Create** ✅

## 🔍 Step 5: Confirm It Works

* Argo CD will **auto-deploy** your manifests
* Visit:
  👉 `http://<minikube-ip>:31000`
* Run:

  ```bash
  minikube ip
  ```

## ✅ Success Criteria

* App shows up in Argo CD UI
* App is accessible in browser
* Changes in Git trigger auto-sync (or manual if sync is disabled)


## 🧠 What You Learned

* GitOps model using Argo CD 🔁
* Kubernetes + Docker app sync from GitHub
* Visual UI for K8s management

> Git is your source of truth — and Argo makes it real! 💥


## 🎉 Bonus Tip

* You can export dashboards
* Add `syncPolicy: automated` to `Application` spec for true GitOps

## 📌 Reference

* [Argo CD Docs](https://argo-cd.readthedocs.io/)
* [Minikube Docs](https://minikube.sigs.k8s.io/docs/)
