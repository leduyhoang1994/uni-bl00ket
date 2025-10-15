FROM node:20-alpine AS build

ARG VITE_UNI_CLASS_BACKEND_HOST
ENV VITE_UNI_CLASS_BACKEND_HOST=$VITE_UNI_CLASS_BACKEND_HOST

COPY Common/ /app/Common/
#
WORKDIR /app/Frontend

COPY Frontend/package*.json ./

RUN npm install

COPY Frontend/ .

RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/Frontend/dist /usr/share/nginx/html

COPY Frontend/docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
