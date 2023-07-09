FROM node:18-alpine as build-stage

# build stage
WORKDIR /app
ENV NODE_ENV=development
ENV NPM_CONFIG_LOGLEVEL warn
RUN yarn install
COPY ["package.json", "package-lock*.json", "./"]
COPY ["nginx.conf", "./"]
COPY . .
RUN yarn

# production stage
FROM nginx:stable-alpine as production-stage
RUN mkdir -p /usr/share/nginx/html
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf
ENV NODE_ENV=production
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
