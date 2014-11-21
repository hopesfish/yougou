#!/bin/bash

mkdir /opt/
cd /opt/

#wget 
yum -y install wget

#prep for nginx
wget http://www.atomicorp.com/installers/atomic
sh ./atomic
yum -y check-update

#svn
yum -y install subversion

#nginx
yum -y install nginx

#git
yum -y install git

#unzip
yum -y install unzip

yum -y install mysql mysql-server
yum -y install php-fpm php-pdo_mysql  
yum -y install memcached
yum -y install php-pecl-memcache
yum -y install php-gd

chkconfig --levels 235 mysqld on
chkconfig --levels 235 nginx on
chkconfig --levels 235 php-fpm on

#iptable
iptables -P INPUT DROP  
iptables -P FORWARD DROP  
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A INPUT -p udp --sport 53 -j ACCEPT
iptables -A INPUT -p udp --dport 53 -j ACCEPT
iptables -A OUTPUT -p udp --sport 53 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 31337 -j DROP
iptables -A OUTPUT -p tcp --dport 31337 -j DROP
iptables -A INPUT -s 127.0.0.1 -d 127.0.0.1 -j ACCEPT  
iptables -A INPUT -m state --state ESTABLISHED -j ACCEPT
iptables -P OUTPUT ACCEPT
service iptables save

#nodejs
cd /opt/
wget http://nodejs.org/dist/v0.10.26/node-v0.10.26-linux-x64.tar.gz
tar xvf node-v0.10.26-linux-x64.tar.gz
cd /usr/local/bin
ln -s /opt/node-v0.10.26-linux-x64/bin/node node
ln -s /opt/node-v0.10.26-linux-x64/bin/npm npm

#forever for webot
npm install -g forever


yum -y install nginx mysql-server php-fpm php-cli php-pdo php-mcrypt php-mbstring php-gd php-tidy php-xml php-xmlrpc php-pear php-pecl-memcache php-eaccelerator
