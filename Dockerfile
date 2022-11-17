FROM node:alpine
ENV JWT_SECRET=
ENV DB_USERNAME=
ENV DB_PASSWORD=
ENV DB_HOST=
ENV DB_PORT=
ENV DB_NAME=
WORKDIR /app
COPY ./dist .
COPY package.json .
RUN npm install --production
EXPOSE 8080:8080
CMD ["node", "app.js"]