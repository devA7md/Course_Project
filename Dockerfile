FROM node:latest

# Create app directory
WORKDIR /usr/src/myproject

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
