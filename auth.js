const express = require('express');
const fs = require('fs');
const app = express();
const port = 5000;

let token;

const TOKEN_FILE = '/auth/data/token.txt';

function generateToken() {
    return Math.floor(100000000000000 + Math.random() * 900000000000000).toString(36);
}

function getOrCreateToken() {
    try {
        if (fs.existsSync(TOKEN_FILE)) {
            token = fs.readFileSync(TOKEN_FILE, 'utf8');
        } else {
            token = generateToken();
            fs.mkdirSync('/auth/data', { recursive: true });
            fs.writeFileSync(TOKEN_FILE, token);
        }
    } catch (error) {
        console.error('Error handling token:', error);
        token = generateToken();
    }
    return token;
}

token = getOrCreateToken();
console.log('Ready !');
console.log('Token: ', token)
app.get('/auth', (req, res) => {
    const Authorization = req.headers.authorization;
    if (Authorization == token) {
        res.status(200).send('Authorized');
    } else {
        res.status(401).json({
            status: false,
            message: 'Error',
            meta: 'Not Authorized'
        })
    }
});
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))