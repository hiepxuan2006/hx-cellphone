FROM node:16  
WORKDIR /app  
COPY package.json package-lock.json ./  
RUN yarn install  
COPY . /app  
EXPOSE 5005  
COPY . .
CMD node index.js
