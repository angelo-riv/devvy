# Use official Node.js image
FROM node:20

# Create app directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies (if needed)
RUN npm install

# Run test cases by default
CMD ["node", "test.js"]
