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

