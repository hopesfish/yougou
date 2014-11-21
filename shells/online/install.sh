#!/bin/bash

mkdir /opt/
cd /opt/

#wget 
yum -y install wget

#wget
yum -y install unzip

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

yum -y install php-fpm php-pdo_mysql  
yum -y install memcached
yum -y install php-pecl-memcache
yum -y install php-gd

#iptable
iptables -P INPUT DROP  
iptables -P FORWARD DROP  
iptables -A INPUT -p tcp --dport 60777 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 3000 -j ACCEPT
iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
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
