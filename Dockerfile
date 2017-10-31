FROM node:8.5.0
MAINTAINER Kota Miyamoto
WORKDIR /assign2
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN npm install express -g
ADD ./ /assign2
EXPOSE 80
CMD ["node", "app.js"]
