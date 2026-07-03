const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Server is up and running smoothly!');
});

app.listen(PORT, () => {
    console.log(`Application is listening on http://localhost:${PORT}`);
});