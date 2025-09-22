FROM node:20-alpine

# Cài đặt PM2 toàn cục
RUN npm install pm2 -g

# Sao chép các file cần thiết
COPY Common/ /app/Common/
WORKDIR /app/Backend
COPY Backend/package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép mã nguồn và build
COPY Backend/ .
RUN npm run build

EXPOSE 4000

CMD ["pm2-runtime", "ecosystem.config.js"]