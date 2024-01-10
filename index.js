// Package yang di gunakan
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
// express api
const express = require('express');
const app = express();
const port = 8080;

// Membuat Client Baru
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    },
});

//Proses Masuk whatsappjs menggunakan qrcode yang akan di kirim oleh whatsapp-web.js
client.on('qr', (qr) => {
    qrcode.generate(qr, {
        small: true
    });
});

//Proses Dimana Whatsapp-web.js Siap digunakan
client.on('ready', () => {
    console.log('Ready !');
    console.log('Token: ')
    const token = Math.floor(100000000 + Math.random() * 900000000);
    console.log(token)
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.post('/api/send', (req, res) => {
        const Authorization = req.headers.authorization;
        console.log(Authorization, req.body)
        if (Authorization == token) {
            var phonetemp = req.body.phone
            if (phonetemp.startsWith('0')) {
                phonetemp = '62' + phonetemp.slice(1);
            } else if (phonetemp.startsWith('8')) {
                phonetemp = '62' + phonetemp;
            } else if (phonetemp.startsWith('+')) {
                phonetemp = phonetemp.slice(1);
            }
            const phone = phonetemp;
            const message = req.body.message;
            client.sendMessage(phone + "@c.us", message)
                .then(response => {
                    res.status(200).json({
                        status: true,
                        message: 'Success',
                        meta: response,

                    });
                })
                .catch(e => {
                    console.log(e)
                    res.status(200).json({
                        status: false,
                        message: 'Error',
                        meta: err,
                    });
                });
        } else {
            res.status(401).json({
                status: false,
                message: 'Error',
                meta: 'Not Authorized'
            })
        }
    });
    app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))
});

//Proses Dimana klient disconnect dari Whatsapp-web
client.on('disconnected', (reason) => {
    console.log('disconnect Whatsapp-bot', reason);
});

client.initialize();