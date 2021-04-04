FROM node:14 as build
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn install
FROM node:14-alpine
WORKDIR /app
COPY --from=build /usr/src/app /app
EXPOSE 4000
CMD ["npm", "run", "start"]
