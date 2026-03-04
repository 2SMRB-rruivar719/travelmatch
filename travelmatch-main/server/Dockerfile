FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000
CMD ["node", "index.js"]
