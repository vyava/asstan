# ############ BASE STAGE ########## #
######################################
# Install dependencies only when needed
FROM node:alpine AS base
# Set working directory
WORKDIR /app
COPY package.json .

# ######## DEVELOPMENT STAGE ####### #
######################################
FROM base AS development
ENV NODE_ENV=development
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install

# Run development if no command specified in docker-compose
CMD ["npm", "run", "dev"]

# ######## PRODUCTION STAGE ######## #
######################################
FROM base AS production

# Install PM2 globally
RUN npm install --global pm2

# Build app
RUN npm run build

EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node

# Run npm start script with PM2 when container starts
CMD [ "pm2-runtime", "npm", "--", "start" ]