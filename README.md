Buat Dockerfile
1. docker build -t whatsapp-api:auth .
2. docker run -p 5000:5000 --name whatsappapi --restart unless-stopped whatsapp-api:auth
