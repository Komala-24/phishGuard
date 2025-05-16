const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow all origins

app.get('/api/openphish', async (req, res) => {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch('https://openphish.com/feed.txt');
  const text = await response.text();
  res.type('text').send(text);
});

app.listen(3001, () => console.log('Backend running on port 3001'));