const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const port = 3000;

// Membuat Client Baru
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
            '--no-zygote',
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-extensions',
            '--disable-default-apps',
            '--disable-sync',
            '--disable-translate',
            '--disable-web-security',
            '--disable-features=site-per-process',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
            '--disable-gpu',
            '--disable-webgl',
            '--disable-threaded-animation',
            '--disable-threaded-scrolling',
            '--disable-in-process-stack-traces',
            '--disable-histogram-customizer',
            '--disable-gl-extensions',
            '--disable-composited-antialiasing',
            '--disable-canvas-aa',
            '--disable-3d-apis',
            '--disable-accelerated-2d-canvas',
            '--disable-accelerated-jpeg-decoding',
            '--disable-accelerated-mjpeg-decode',
            '--disable-app-list-dismiss-on-blur',
            '--disable-accelerated-video-decode'
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
    const token = Math.floor(100000000000000 + Math.random() * 900000000000000).toString(36);
    console.log('Token: ', token)
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.post('/api/send', (req, res) => {
        const Authorization = req.headers.authorization;
        if (Authorization == token) {
            try {
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
                    .catch(err => {
                        res.status(200).json({
                            status: false,
                            message: 'Error',
                            meta: err,
                        });
                    });
            } catch (err) {
                res.status(200).json({
                    status: false,
                    message: 'Error',
                    meta: err,
                });
            }
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
