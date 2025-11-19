# Stage 1: Install dependencies and build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (copy package files only to leverage caching)
COPY package.json package-lock.json ./

# Install dependencies including devDependencies (for typescript, tailwind, etc.)
RUN npm install

# Copy all project files
COPY . .

# Build the Next.js app for production
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Expose port 3000 for Next.js default
EXPOSE 3000

# Run the Next.js app in production mode
CMD ["npm", "start"]
