# Base image Node.js versi terbaru
FROM node:latest

# Membuat direktori kerja di dalam container
WORKDIR /auth
ENV LANG=en_US.UTF-8

# Meng-clone repository dari GitHub
RUN git clone -b auth https://github.com/reynaldiarya/WhatsApp-API.git .

# Meng-copy package.json dan package-lock.json (jika ada)
COPY package*.json ./
COPY ecosystem.config.js .

# Menginstall dependencies
RUN npm install

# Menjalankan aplikasi menggunakan node
CMD ["node", "auth.js"]
