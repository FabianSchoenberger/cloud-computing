FROM node:21.7.1 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm clean-install
COPY . .
RUN npm run build --mode=production

FROM node:21.7.1
WORKDIR /app
COPY --from=build /app/package.json /app/build ./
ENTRYPOINT node index.js
