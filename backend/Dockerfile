# Create a docker image for the api
FROM node:19-alpine

# Change directory so that our commands run inside this new directory
WORKDIR /

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code to the working directory
COPY . .

# Expose port 3000
EXPOSE 3000

#RUN npm run build

# Run the app
# CMD ["npm", "run", "start"]
CMD ["npx", "ts-node", "src/server.ts"]