FROM node:20-alpine  
WORKDIR /usr/src/app  
COPY package*.json ./  
RUN npm run dev  
COPY . .  
EXPOSE 3000  
CMD ["node", "auto.js"]
