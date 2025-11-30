FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose Astro port
EXPOSE 4321

# Start Astro dev server
CMD ["npm", "run", "dev", "--", "--host"]
