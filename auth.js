const express = require('express');
const app = express();
const port = 5000;

console.log('Ready !');
const token = Math.floor(100000000000000 + Math.random() * 900000000000000).toString(36);
console.log('Token: ', token)
const Authorization = req.headers.authorization;
if (Authorization == token) {
    next();
} else {
    res.status(401).json({
        status: false,
        message: 'Error',
        meta: 'Not Authorized'
    })
}
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))