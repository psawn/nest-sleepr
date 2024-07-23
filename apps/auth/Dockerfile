FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json tsconfig.json

RUN npm i

# if want to seperate package.json -> use this line below instate of COPY apps/auth apps/auth
# COPY apps/auth /auth
COPY apps/auth apps/auth
COPY libs libs

# if want to seperate package.json -> use this line below
# RUN cd /auth && npm i

RUN npm run build

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]

# # Use a node base image for the development stage
# FROM node:alpine AS development

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json (if available)
# COPY package*.json ./

# # Copy TypeScript configuration
# COPY tsconfig.json tsconfig.json

# # Install all dependencies
# RUN npm ci

# # Copy the application code
# COPY apps/auth apps/auth
# COPY libs libs

# # Use a node base image for the build stage
# FROM node:alpine AS build

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Copy tsconfig.json to ensure TypeScript can find its configuration
# COPY tsconfig.json tsconfig.json

# # Copy node_modules from the development stage
# COPY --from=development /usr/src/app/node_modules ./node_modules

# # Build the application
# RUN npm run build

# # Set NODE_ENV environment variable
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# # Install only production dependencies and clean npm cache
# # Updated to use --omit=dev based on npm warning
# RUN npm ci --omit=dev && npm cache clean --force

# # Use a node base image for the production stage
# FROM node:alpine AS production

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Copy node_modules and build artifacts from the build stage
# COPY --from=build /usr/src/app/node_modules ./node_modules
# COPY --from=build /usr/src/app/dist ./dist

# # Command to run the application
# CMD ["node", "dist/apps/auth/main"]