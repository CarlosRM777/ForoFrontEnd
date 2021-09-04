FROM node:alpine
RUN mkdir -p /app
WORKDIR /app
COPY . .
#
RUN npm install
RUN npm rebuild esbuild
RUN npm run build --prod

CMD ["npm", "start"]
