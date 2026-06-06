# Simple Dockerfile for MEDS backend
# Used by /home/user/Bureau/LambTech/docker-compose.yml (build: ./backend)

FROM node:20-alpine

WORKDIR /usr/src/app

# Install deps first (better layer caching)
COPY package*.json ./
# install y compris devDependencies (tsx est en devDependencies)
RUN npm install --include=dev

# Copy source
COPY . .

# Build TypeScript (optional but helps start reliably)
RUN npm run build || true

COPY docker-entrypoint.sh /usr/src/app/docker-entrypoint.sh
RUN chmod +x /usr/src/app/docker-entrypoint.sh

EXPOSE 5000

# Default entrypoint: build (already done), optionally run seeds, then start
CMD ["sh", "/usr/src/app/docker-entrypoint.sh"]

