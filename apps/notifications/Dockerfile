FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json tsconfig.json

RUN npm i

# if want to seperate package.json -> use this line below instate of COPY apps/auth apps/auth
# COPY apps/notifications /notifications
COPY apps/notifications apps/notifications
COPY libs libs

# if want to seperate package.json -> use this line below
# RUN cd /auth && npm i

RUN npm run build notifications

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/notifications/main"]