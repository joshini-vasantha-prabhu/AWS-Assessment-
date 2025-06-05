# 📊 Monitoring Stack with Prometheus + Grafana

This task sets up a complete **local monitoring stack** using:

- 🔍 **Prometheus** for metrics scraping
- 📊 **Grafana** for beautiful dashboards
- 🌐 A sample **Node.js app** with `/metrics` endpoint using Prometheus client format

All deployed locally via Docker Compose 🐳

## 📁 Folder Structure

```

monitoring\_stack/
├── docker-compose.yml
├── prometheus/
│   └── prometheus.yml
├── grafana/
│   └── (persistent volume data)
└── app/
├── app.js
├── Dockerfile
└── package.json

````


## 🎯 Objective

1. 📦 Deploy a custom Node.js app exposing `/metrics`
2. 🔁 Configure Prometheus to scrape the app
3. 📊 Visualize metrics in Grafana
4. 🧠 Create a dashboard and export it (bonus)


## ⚙️ Prerequisites

| Tool        | Check With            |
|-------------|------------------------|
| Docker      | `docker --version`     |
| curl (for healthcheck) | `curl --version` |
| Browser     | ✅ Chrome/Firefox/etc   |


## 🧰 Step-by-Step Setup


### ✅ Step 1: Node.js App with Metrics

📁 `app/app.js`

```js
const express = require('express');
const client = require('prom-client');
const app = express();
const register = client.register;

const counter = new client.Counter({
  name: 'node_request_operations_total',
  help: 'Total number of requests'
});

app.get('/', (req, res) => {
  counter.inc(); // increment metric
  res.send('✅ Hello from monitoring app!');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => {
  console.log('🚀 App running on http://localhost:3000');
});
````

📁 `app/package.json`

```json
{
  "name": "monitoring-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "prom-client": "^14.1.0"
  },
  "scripts": {
    "start": "node app.js"
  }
}
```

📁 `app/Dockerfile`

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

---

### 📊 Step 2: Prometheus Config

📁 `prometheus/prometheus.yml`

```yaml
global:
  scrape_interval: 10s

scrape_configs:
  - job_name: 'node-app'
    static_configs:
      - targets: ['node-app:3000']
```

---

### 🐳 Step 3: Docker Compose Setup

📁 `docker-compose.yml`

```yaml
version: '3.8'

services:
  node-app:
    build: ./app
    ports:
      - "3000:3000"

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    volumes:
      - grafana-storage:/var/lib/grafana

volumes:
  grafana-storage:
```

---

### ▶️ Step 4: Run the Stack

From inside the `monitoring_stack/` folder:

```bash
docker-compose up --build
```

✅ This starts all 3 services in the background.


## 🌐 Access Services

| URL                                                            | What You'll See           |
| -------------------------------------------------------------- | ------------------------- |
| [http://localhost:3000](http://localhost:3000)                 | Your Node.js app homepage |
| [http://localhost:3000/metrics](http://localhost:3000/metrics) | Prometheus-format metrics |
| [http://localhost:9090](http://localhost:9090)                 | Prometheus UI             |
| [http://localhost:3001](http://localhost:3001)                 | Grafana Dashboard Login   |


## 🔑 Grafana Login

Default credentials:

* Username: `admin`
* Password: `admin`

> You will be prompted to change the password on first login.

## 📊 Step 5: Create Dashboard in Grafana

1. Go to **[http://localhost:3001](http://localhost:3001)**
2. Login → Click **Add Data Source**
3. Choose **Prometheus**
4. Set URL to: `http://prometheus:9090`
5. Click **Save & Test**
6. Go to Dashboards → **+ Create → Add Panel**
7. Query: `node_request_operations_total`
8. Click **Apply**

✅ Now you'll see request metrics in real-time!


## 🧠 Bonus: Export Dashboard

1. Go to the dashboard → Settings
2. Click **JSON Model**
3. Save it locally to reuse or import later

## ✅ Success Criteria

* Node.js app runs and exposes `/metrics`
* Prometheus successfully scrapes the metrics
* Grafana visualizes them on a dashboard
* Everything runs locally via Docker Compose


## 🧠 What You Learned

* How to create Prometheus-compatible metrics in Node.js
* How to scrape metrics using Prometheus
* How to visualize data in Grafana
* How to automate everything with Docker Compose

> DevOps isn’t complete without observability — and now you’ve got it! 📡
