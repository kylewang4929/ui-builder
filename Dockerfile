FROM daocloud.io/gizwits2015/g-node-with-nginx-image:latest

RUN npm install -g bower grunt-cli cnpm
RUN mkdir /npm-cache
WORKDIR /npm-cache
ADD package.json ./
RUN cnpm install --allow-root
ADD bower.json ./
RUN bower install --allow-root

WORKDIR /app
ADD . /app/
RUN mv /npm-cache/* ./ && \
    grunt build && \
    cp -R /app/dist/*  /usr/share/nginx/html && \
    cat /app/theNginx.conf > /etc/nginx/conf.d/default.conf && \
    rm -rf /app
    
CMD ["nginx", "-g","daemon off;","grunt","cnpm","bower"]
