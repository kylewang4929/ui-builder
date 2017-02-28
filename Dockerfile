FROM daocloud.io/nginx
docker pull digitallyseamless/nodejs-bower-grunt

WORKDIR /app
ADD package.json /app/
RUN npm install
RUN docker run -it --rm digitallyseamless/nodejs-bower-grunt bower install
ADD . /app/
RUN docker run -it --rm digitallyseamless/nodejs-bower-grunt grunt build && \
    cp -R /app/dist/*  /usr/share/nginx/html && \
    rm -rf /app

ENTRYPOINT ["nginx", "-g","daemon off;"]