FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Generate Prisma Client
COPY prisma ./prisma/
RUN npx prisma generate

# Build application
COPY . .
RUN npm run build

EXPOSE 8000
CMD ["npm", "start"]
