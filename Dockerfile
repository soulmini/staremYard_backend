FROM ubuntu:focal

RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs ffmpeg && \
    npm i -g nodemon

WORKDIR /home/app

CMD ["nodemon", "dist/index.js"]