FROM daocloud.io/nginx
FROM daocloud.io/node

WORKDIR /app
ADD package.json /app/
RUN npm install -g bower grunt-cli
RUN sudo bower install
RUN npm install
ADD . /app/
RUN sudo grunt build && \
    cp -R /app/dist/*  /usr/share/nginx/html && \
    rm -rf /app

CMD ["bower", "grunt"]
ENTRYPOINT ["nginx", "-g","daemon off;"]