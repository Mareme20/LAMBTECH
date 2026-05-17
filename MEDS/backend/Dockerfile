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

EXPOSE 5000

# Start in dev mode by default (ts, watch)
CMD ["npm","run","dev"]

