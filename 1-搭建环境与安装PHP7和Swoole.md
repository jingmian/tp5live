
### 搭建环境
-----------------------------------  
系统：采用的是腾讯云服务器的linux（centos）主机，务必在安全组放通对应端口，否则无法访问，如不确定则放通全部端口

通过SecureCRT8.0连接服务器命令行界面，通过WinSCP连接服务器文件系统

### PHP7安装
 -----------------------------------  
>安装前准备，安装基础扩展

```Bash
yum -y install libxml2 libxml2-devel openssl openssl-devel bzip2 bzip2-devel libcurl libcurl-devel libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel gmp gmp-devel libmcrypt libmcrypt-devel readline readline-devel libxslt libxslt-devel gcc gcc-c++  autoconf pcre-devel
```

>新建php目录，可自由选择

```Bash
cd /usr/local/
mkdir php
cd php
```

>下载php7源码编译安装

```Bash
#下载php7
wget -O php7.tar.gz http://cn2.php.net/get/php-7.1.1.tar.gz/from/this/mirror
#解压
tar -xvf php7.tar.gz
#进入php目录，可能目录不是对应下面目录
cd php-7.1.1
#编译--prefix 为你的安装目录 --with-config-file-path 为你的配置文件php.ini所在的位置
./configure \
--prefix=/usr/local/php \
--with-config-file-path=/usr/local/php \
--enable-fpm \
--with-fpm-user=nginx \
--with-fpm-group=nginx \
--enable-inline-optimization \
--disable-debug \
--disable-rpath \
--enable-shared \
--enable-soap \
--with-libxml-dir \
--with-xmlrpc \
--with-openssl \
--with-mcrypt \
--with-mhash \
--with-pcre-regex \
--with-sqlite3 \
--with-zlib \
--enable-bcmath \
--with-iconv \
--with-bz2 \
--enable-calendar \
--with-curl \
--with-cdb \
--enable-dom \
--enable-exif \
--enable-fileinfo \
--enable-filter \
--with-pcre-dir \
--enable-ftp \
--with-gd \
--with-openssl-dir \
--with-jpeg-dir \
--with-png-dir \
--with-zlib-dir \
--with-freetype-dir \
--enable-gd-native-ttf \
--enable-gd-jis-conv \
--with-gettext \
--with-gmp \
--with-mhash \
--enable-json \
--enable-mbstring \
--enable-mbregex \
--enable-mbregex-backtrack \
--with-libmbfl \
--with-onig \
--enable-pdo \
--with-mysqli=mysqlnd \
--with-pdo-mysql=mysqlnd \
--with-zlib-dir \
--with-pdo-sqlite \
--with-readline \
--enable-session \
--enable-shmop \
--enable-simplexml \
--enable-sockets \
--enable-sysvmsg \
--enable-sysvsem \
--enable-sysvshm \
--enable-wddx \
--with-libxml-dir \
--with-xsl \
--enable-zip \
--enable-mysqlnd-compression-support \
--with-pear \
--enable-opcache
#安装
make && make install
```
>配置环境变量

```Bash
vi /etc/profile
#在末尾追加 path 为你自己的php路径下的bin目录
PATH=$PATH:/usr/local/php/bin
export PATH
#重新加载 安装完成
source /etc/profile
#（测试）查看当前php版本
php -v
```
>加载php.ini文件

```Bash
#查看php.ini是否加载成功及存放路径
php --ini
#复制php解压目录下的php.ini-development到对应的php.ini文件，路径需按自己的
cp /usr/local/php/php-7.1.1/php.ini-development /usr/local/php/php.ini
```
### Swoole安装

>进入php目录，通过pecl安装

```Bash
cd /usr/local/php
#安装过程中提示是否需要加载扩展，全部回车即可
pecl install swoole
```
>加载swoole扩展
```Bash
#编辑php.ini
vi /usr/local/php/php.ini
#增加extension=swoole.so
#查看swoole是否安装成功
php -m
```
>安装git
```Bash
yum -y install git
```
>安装phpredis扩展
```Bash
#git安装phpredis扩展
git clone https://github.com/phpredis/phpredis
#进入目录
cd phpredis
#你的php安装目录下面的bin目录下面的phpize命令
/usr/local/php/bin/phpize
#--with-php-config 为你的php安装目录下面的bin目录下面的php-config命令
./configure --with-php-config=/usr/local/php/bin/php-config
#安装
make && make install
```
>安装redis
```Bash
yum -y install redis
#配置php.ini
vi /usr/local/php/php.ini
#加入extension=redis.so即可
#查看php扩展是否加载redis
php -m
#启动redis （切记先启动redis，否则发送验证码报错）
/usr/bin/redis-server
#redis客户端查询 (不必操作)
/usr/bin/redis-cli
```
