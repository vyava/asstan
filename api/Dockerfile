FROM node:12.17.0-alpine

RUN mkdir -p /usr/api
WORKDIR /usr/api

# Add package file
COPY package*.json ./
COPY tsconfig.json ./

# Install deps
RUN npm i

# Copy source
COPY . ./

ENV API_PORT=7000
ENV API_ROOT=api/v1/
ENV MONGO_URL=mongodb+srv://admin:Zafer_1721@cluster0.thx7h.gcp.mongodb.net/asstan?retryWrites=true&w=majority
ENV SENDGRID_API_KEY=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

COPY types/exceljs/index.d.ts node_modules/exceljs/index.d.ts

# Build dist
RUN npm run build

# Expose port 7000
EXPOSE 7000

CMD [ "node", "./dist/index.js" ]