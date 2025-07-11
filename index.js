const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 3000

app.use(express.json());

app.use(express.static('public'));

app.get('/token', (req, res) => {
  res.sendFile(path.join(__dirname, 'token.json'))
})

app.put('/token', (req, res) => {
  const updated_token = req.body;
  fs.writeFile(path.join(__dirname, 'token.json'), JSON.stringify(updated_token), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send('Token updated successfully');
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
