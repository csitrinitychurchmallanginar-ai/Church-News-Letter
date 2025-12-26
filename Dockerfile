FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root to install dependencies if needed, though puppeteer image has them.
# We need to copy files.
USER root

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (skipping chromium download since the base image has it)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

RUN npm install

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Expose the port Render expects (though they set PORT env var, we just expose 3000/3001 for documentation)
EXPOSE 3001

# Start the server
CMD ["npm", "run", "start:prod"]
