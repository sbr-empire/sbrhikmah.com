# Multi-stage production build for Node.js AI backend
FROM node:18-alpine AS deps

WORKDIR /app

# Install dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY package*.json ./
COPY api ./api

# Health check for Cloud Run
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5173) + '/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port (Cloud Run will set PORT env var)
EXPOSE 5173

# Start the application
CMD ["npm", "start"]
