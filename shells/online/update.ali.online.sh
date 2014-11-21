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
bash online/host.sh
rm -rf /ect/nginx/conf.d/*
cp -R online/nginx/conf.d/* /etc/nginx/conf.d
service nginx restart

#code
cd /opt
rm -rf yougou
svn checkout --username cloverren@163.com --password cloverren --no-auth-cache https://svn.sinaapp.com/yougouwx/1/api ./yougou
cd yougou
find ./ -name ".svn" -exec rm -rfv {}  \;
rm -rf upload
cd ..
mkdir /var/www
mkdir /var/www/html
mkdir /var/www/html/yougou
cp -frap yougou/* /var/www/html/yougou

#web
cd /var/www/html/yougou/api/public
mkdir assets
chmod 777 assets
cd ../protected
mkdir runtime
chmod 777 runtime

#online
sed -i "s#test.yougouwx.us#114.215.140.49#g" `grep -lr test.yougouwx.us /var/www/html/yougou/*`

#nginx
chown nginx:nginx -R /var/www/html/*
service php-fpm restart

#webot
mkdir /var/www/html/yougou-webot
cd /opt
rm -rf yougou-webot
svn checkout --username cloverren@163.com --password cloverren --no-auth-cache https://svn.sinaapp.com/yougouwx/1/webot ./yougou-webot
cd yougou-webot
find ./ -name ".svn" -exec rm -rfv {}  \;
cp -frap ./* /var/www/html/yougou-webot
cd /var/www/html/yougou-webot/conf
mv -f index.online.js index.js

#sed
sed -i "s#test.yougouwx.us#114.215.140.49#g" `grep -lr test.yougouwx.us /var/www/html/yougou-webot/*`
mobile_build_version=`date +%Y%m%d%s`
sed -i "s#mobile_build_version#${mobile_build_version}#g" `grep -lr mobile_build_version /var/www/html/yougou-webot/*`

#start
cd /var/www/html/yougou-webot
npm install
forever start -l forever.log -a app.js