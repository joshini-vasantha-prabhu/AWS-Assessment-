# ☸️ Kubernetes Deployment with Minikube

This task demonstrates how to deploy a Dockerized Node.js app to a **local Kubernetes cluster** using **Minikube**. It's a hands-on DevOps simulation to understand real-world Kubernetes deployments.


## 📁 Folder Structure

```
kubernetes\_assessment/
├── deployment.yaml      # K8s Deployment spec
├── service.yaml         # K8s Service (NodePort)

````

## 🎯 Objective

Deploy your Node.js Docker app into a Kubernetes cluster running locally via **Minikube**.


## ⚙️ Prerequisites

Before proceeding, ensure the following are installed:

| Tool         | Check With             |
|--------------|------------------------|
| 🐳 Docker     | `docker --version`     |
| ☸️ Minikube   | `minikube version`     |
| 🔧 kubectl   | `kubectl version --client` |

Also make sure your app is containerized — e.g., the image built in Task 1 is available locally or pushed to Docker Hub.


## 🧰 Step-by-Step Guide

### 🚀 Step 1: Start Minikube

```bash
minikube start
````

Minikube will create a local cluster with Docker + Kubernetes.

### 🐳 Step 2: Build Docker Image Inside Minikube

If you’re using a local image (not DockerHub):

```bash
eval $(minikube docker-env)
docker build -t jenkins-app ./ci-cd-jenkins/app
```

Or pull from DockerHub:

```bash
docker pull joshinijose0419/jenkins-app:latest
```

---

### 📦 Step 3: Apply Kubernetes Files

Apply deployment and service:

```bash
kubectl apply -f kubernetes_assessment/deployment.yaml
kubectl apply -f kubernetes_assessment/service.yaml
```

---

### 🧪 Step 4: Verify Deployment

Check pods and services:

```bash
kubectl get pods
kubectl get services
```

Example output:

```
NAME                       READY   STATUS    RESTARTS   AGE
jenkins-app-deployment-... 1/1     Running   0          30s

NAME              TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
jenkins-app-svc   NodePort   10.97.12.54    <none>        3000:31000/TCP   2m
```

### 🌐 Step 5: Access the App

Get Minikube IP:

```bash
minikube ip
```

Then open the app:

```url
http://<minikube-ip>:31000
```

✅ Example: `http://192.168.49.2:31000`

## 🛠 deployment.yaml Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jenkins-app-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jenkins-app
  template:
    metadata:
      labels:
        app: jenkins-app
    spec:
      containers:
      - name: jenkins-app
        image: joshini1212/jenkins-app:latest
        ports:
        - containerPort: 3000
```

## 🌐 service.yaml Example

```yaml
apiVersion: v1
kind: Service
metadata:
  name: jenkins-app-svc
spec:
  type: NodePort
  selector:
    app: jenkins-app
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 31000
```

## 🔍 Troubleshooting

* ❌ **Can't access app in browser?**

  * Make sure you're using `minikube ip`
  * Port must match `nodePort` in your YAML

* ❌ **Pod stuck in `ErrImagePull`?**

  * Check image name and registry access
  * Run: `kubectl describe pod <pod-name>`

## ✅ Done!

You’ve now deployed a real Dockerized app into Kubernetes with:

* 🎛️ Deployment controller
* 🌐 Service exposure
* 🏗️ Local cluster with Minikube
