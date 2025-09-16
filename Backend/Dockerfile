FROM node:20-alpine

COPY Common/ /app/Common/

WORKDIR /app/Backend

COPY Backend/package*.json ./

RUN npm install

COPY Backend/ .

RUN npm run build

EXPOSE 3000

CMD ["node", "build/Backend/src/app.js"]
