FROM node:alpine as development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm i

COPY apps/payments apps/payments
COPY libs libs

RUN npm run build payments

FROM node:alpine as production

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json tsconfig.json

RUN npm i --only=production && npm cache clean --force

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/payments/main"]