#!/bin/bash
#stop
service nginx stop
forever stopall

#init
mkdir /var/www
mkdir /var/www/html
mkdir /var/www/html/yougou
mkdir /var/www/html/yougou-static
mkdir /var/www/html/yougou-webot
mkdir /var/www/html/yougou-dream
mkdir /var/www/html/yougou-xmas
mkdir /var/www/html/yougou-luckybag

#code
cd /home/yougou/yougou
git reset --hard
git pull

cp -frap api/* /var/www/html/yougou
cp -frap static/* /var/www/html/yougou-static
cp -frap webot/* /var/www/html/yougou-webot
cp -frap activity/dream/* /var/www/html/yougou-dream
cp -frap activity/xmas/* /var/www/html/yougou-xmas
cp -frap activity/luckybag/* /var/www/html/yougou-luckybag

#update ngingx
cd /home/yougou/yougou/shells/online/nginx/conf.d
rm -f /etc/nginx/conf.d/*
cp -f *.conf /etc/nginx/conf.d

#777
mkdir /var/www/html/yougou/protected/runtime
chmod 777 /var/www/html/yougou/protected/runtime
chown nginx:nginx -R /var/www/html/*

service php-fpm restart

#webot
cd /var/www/html/yougou-webot
#npm update
cd /var/www/html/yougou-webot/conf
mv -f index.online.js index.js

#sed
mobile_build_version=`date +%Y%m%d%s`
sed -i "s#mobile_build_version#${mobile_build_version}#g" `grep -lr mobile_build_version /var/www/html/yougou-webot/*`
sed -i "s#mobile_build_version#${mobile_build_version}#g" `grep -lr mobile_build_version /var/www/html/yougou-static/*`
sed -i "s#mobile_build_version#${mobile_build_version}#g" `grep -lr mobile_build_version /var/www/html/yougou-dream/*`
sed -i "s#mobile_build_version#${mobile_build_version}#g" `grep -lr mobile_build_version /var/www/html/yougou-xmas/*`
sed -i "s#mobile_build_version#${mobile_build_version}#g" `grep -lr mobile_build_version /var/www/html/yougou-luckybag/*`

sed -i "s#localhost:3001#117.121.50.27:8083#g" `grep -lr localhost:3001 /var/www/html/yougou-luckybag/*`

cd /var/www/html/yougou-luckybag/public/stylesheets
stylus --compress style.styl

#start
cd /var/www/html/yougou-webot
forever start -l webot.log -a app.js
#npm update
#forever start -l dream.log -a bin/www
cd /var/www/html/yougou-luckybag
#npm install
#npm update
forever start -l luckybag.log -a bin/www

service nginx start


