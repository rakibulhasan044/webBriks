FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN rm -rf node_modules package-lock.json && npm install

# Copy the rest of the application code
COPY . .

# Expose the Next.js port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
