FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json tsconfig.json
# without copying the nest-cli.json file, the build will success
# but will fail to run if do not run compose in root folder
COPY nest-cli.json nest-cli.json

RUN npm i

# if want to seperate package.json -> use this line below instate of COPY apps/auth apps/auth
# COPY apps/auth /auth
COPY apps/auth apps/auth
COPY libs libs

# if want to seperate package.json -> use this line below
# RUN cd apps/auth && npm i

RUN npm run build auth

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]