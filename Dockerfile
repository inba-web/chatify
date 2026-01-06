# Stage 1: Build the frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Build the frontend
RUN npm run build

# Stage 2: Setup the backend and serve the app
FROM node:20-alpine AS production
WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Copy built frontend assets from the build stage
# The server expects ../frontend/dist relative to /app/backend
COPY --from=build-frontend /app/frontend/dist ../frontend/dist

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
