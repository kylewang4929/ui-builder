FROM daocloud.io/gizwits2015/g-node-with-nginx-image:latest

RUN npm install -g cnpm bower grunt-cli
RUN apt-get install git
WORKDIR /app
ADD . /app/
ADD package.json ./
RUN cnpm install --allow-root
ADD bower.json ./
RUN bower install --allow-root
RUN grunt build && \
    cp -R /app/dist/*  /usr/share/nginx/html && \
    cat /app/theNginx.conf > /etc/nginx/conf.d/default.conf && \
    rm -rf /app
    
CMD ["nginx", "-g","daemon off;","grunt","cnpm","bower"]
