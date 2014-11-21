#!/bin/bash
#stop
service nginx stop
forever stopall

#ngix
mkdir opt
cd /opt/
rm -rf shell
mkdir shell
cd shell
svn checkout --username cloverren@163.com --password cloverren --no-auth-cache https://svn.sinaapp.com/yougouwx/1/shells .
bash local/host.sh
rm -rf /ect/nginx/conf.d/*
cp -R local/nginx/conf.d/* /etc/nginx/conf.d
service nginx restart

#start
cd /var/www/html/yougou-webot
forever start -l forever.log -a app.js