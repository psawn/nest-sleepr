FROM node:alpine as development

WORKDIR /usr/src/app

COPY . . 

RUN npm install

RUN npm run build auth

FROM node:alpine as production

COPY package.json ./
COPY tsconfig.json tsconfig.json

RUN npm install

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]