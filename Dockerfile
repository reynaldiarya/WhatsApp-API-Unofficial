# Base image Node.js versi terbaru
FROM node:latest

# Meng-clone repository dari GitHub
COPY WhatsApp-API /app

# Membuat direktori kerja di dalam container
WORKDIR /app
ENV LANG=en_US.UTF-8

# Menginstal PM2 secara global
RUN apt-get update && apt-get install -y chromium

# Meng-copy package.json dan package-lock.json (jika ada)
COPY package*.json ./
COPY ecosystem.config.js .

# Menginstall dependencies
RUN npm install
RUN npm install -g pm2

# Menjalankan aplikasi menggunakan PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
