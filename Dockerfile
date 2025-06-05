FROM node:18-alpine
WORKDIR /app
COPY ./app /app
RUN npm install
CMD ["npm", "start"]

