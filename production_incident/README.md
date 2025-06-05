# 🔥 Simulated Production Incident & Root Cause Analysis (RCA)

This task simulates a **production incident** using a purposely buggy app that fails randomly. The goal is to:

- Reproduce the error
- Investigate logs
- Understand the root cause
- Propose a fix (real or theoretical)

## 📁 Folder Structure
```
production\_incident/
├── docker-compose.yml
└── buggy-app/
├── app.js
├── Dockerfile
└── package.json

````

## 🎯 Objective

1. Run a broken app 🧨
2. Observe random failures (500 errors)
3. Capture logs and analyze behavior
4. Create an RCA (Root Cause Analysis)
5. Propose a fix ✅

## ⚙️ Prerequisites

| Tool     | Command              |
|----------|----------------------|
| Docker   | `docker --version`   |
| Browser  | ✅ Any modern browser |

## 🧰 Step-by-Step Setup

### 🛠 Step 1: Buggy Node.js App

📁 `buggy-app/app.js`

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const n = Math.random();
  if (n < 0.3) {
    console.error("🔥 App crashed with error code 500");
    res.status(500).send("Internal Server Error");
  } else {
    res.send("✅ App is working fine");
  }
});

app.listen(4000, () => {
  console.log('🚀 Buggy app running on http://localhost:4000');
});
````

📁 `buggy-app/package.json`

```json
{
  "name": "buggy-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2"
  },
  "scripts": {
    "start": "node app.js"
  }
}
```

📁 `buggy-app/Dockerfile`

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 4000
CMD ["npm", "start"]
```

### 🐳 Step 2: Docker Compose

📁 `docker-compose.yml`

```yaml
version: '3.8'

services:
  buggy-app:
    build: ./buggy-app
    ports:
      - "4000:4000"
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### ▶️ Step 3: Run the App

```bash
docker-compose up --build
```

### 🌐 Step 4: Reproduce the Issue

1. Visit [http://localhost:4000](http://localhost:4000)
2. Keep refreshing the page
3. ❌ You'll sometimes see: `500 Internal Server Error`
4. ✅ Other times it works


## 🔍 Step 5: Investigate Logs

Run in terminal:

```bash
docker logs -f production_incident_buggy-app_1
```

Look for logs like:

```
🔥 App crashed with error code 500
```


## 🩻 Root Cause Analysis (RCA)

| Category     | Details                                                                 |
| ------------ | ----------------------------------------------------------------------- |
| **Incident** | App fails randomly with HTTP 500                                        |
| **Trigger**  | Random number generator (`Math.random() < 0.3`) simulates crash         |
| **Impact**   | Users receive intermittent 500 errors                                   |
| **Cause**    | Code includes an intentional failure path                               |
| **Logs**     | Printed: `🔥 App crashed with error code 500`                           |
| **Fix**      | Remove random crash logic, add try/catch, implement real error handling |


## ✅ Proposed Fix

Replace this block:

```js
if (n < 0.3) {
  console.error("🔥 App crashed with error code 500");
  res.status(500).send("Internal Server Error");
}
```

With:

```js
try {
  res.send("✅ App is working fine");
} catch (err) {
  console.error("Error occurred:", err);
  res.status(500).send("Something went wrong");
}
```

✅ This ensures the app doesn't crash intentionally and handles real errors properly.


## ✅ Success Criteria

* App runs locally
* Errors are reproducible and logged
* RCA is written and fix is proposed

## 🧠 What You Learned

* How to debug production-like issues locally
* How to capture and interpret container logs
* How to document a real RCA for DevOps/SRE use

