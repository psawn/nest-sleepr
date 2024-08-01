FROM node:alpine as development

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm i

COPY apps/reservations apps/reservations
COPY libs libs

RUN npm run build reservations

FROM node:alpine as production

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json tsconfig.json

RUN npm i --only=production && npm cache clean --force

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/reservations/main"]