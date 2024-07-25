FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json tsconfig.json
# without copying the nest-cli.json file, the build will success
# but will fail to run if do not run compose in root folder
COPY nest-cli.json nest-cli.json

RUN npm i

COPY apps/reservations apps/reservations
COPY libs libs

RUN npm run build reservations

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/reservations/main"]