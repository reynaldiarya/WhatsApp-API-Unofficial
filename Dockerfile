# Base image Node.js versi terbaru
FROM node:22-alpine

# Membuat direktori kerja di dalam container
WORKDIR /app
ENV LANG=en_US.UTF-8

# Menginstall git
RUN apk add --no-cache git

# Meng-clone repository dari GitHub
RUN git clone -b load-balancing https://github.com/reynaldiarya/WhatsApp-API-Unofficial.git .

# Menginstal PM2 secara global
RUN apt-get update && apt-get install -y chromium

# Menginstall dependencies
RUN npm install
RUN npm install -g pm2

# Menjalankan aplikasi menggunakan PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
