# Base image Node.js versi terbaru
FROM node:22-alpine

# Membuat direktori kerja di dalam container
WORKDIR /app
ENV LANG=en_US.UTF-8

# Menginstall sistem
RUN apk add --no-cache \
    git \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Meng-clone repository dari GitHub
RUN git clone -b load-balancing https://github.com/reynaldiarya/WhatsApp-API-Unofficial.git .

# Menginstall dependencies
RUN npm install
RUN npm install -g pm2

# Menjalankan aplikasi menggunakan PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
