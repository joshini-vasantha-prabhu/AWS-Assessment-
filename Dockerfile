FROM node:18-alpine
WORKDIR /app
COPY ci-cd-jenkins/app /app
RUN npm install
CMD ["npm", "start"]

