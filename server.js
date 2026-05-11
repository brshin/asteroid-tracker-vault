const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.json({ message: "Houston, the Asteroid Tracker server is online!" });
});

app.listen(PORT, () => {
    console.log('Server is orbiting on http://localhost:${PORT}');
});