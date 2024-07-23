FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json tsconfig.json

RUN npm i

# if want to seperate package.json -> use this line below instate of COPY apps/auth apps/auth
# COPY apps/payments /payments
COPY apps/payments apps/payments
COPY libs libs

RUN npm run build

# if want to seperate package.json -> use this line below
# RUN cd /auth && npm i

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/payments/main"]