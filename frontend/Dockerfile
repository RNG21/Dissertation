# Excpected dir: frontend
FROM node:20-alpine AS builder

# Install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --production=false

# Copy source and build
COPY . .
RUN npm run build

### ---- Production stage ----
FROM nginx:1.25-alpine AS production

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port and start server
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]