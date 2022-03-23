#!/bin/bash

SERVER=194.233.76.255
FILENAME='internal-dist.txt'
PATH_SERVER=/tmp
USER=root
USER_DOCKER_HUB=kaitoryouga
PASS_DOCKER_HUB=4720Ryougakaito

echo -e "\n----------------- Step 1: Build image ----------------------\n"
docker build -t template-api-build .    
if [ ! $? -eq 0 ]
then
    echo -e "\nError: Build image error.\n"
    exit 1
fi
echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 2: Run container test ----------------------\n"
docker rm -f template-api-build
docker run -d -p 3333:3009 --name template-api-build template-api-build

CHECK_RUNNING=$(docker ps --filter "name=template-api-build" --filter "status=running" | wc -l)

if [ $CHECK_RUNNING -eq 1 ]
then
    echo -e "\nError: Run container error.\n"
    exit 1
fi
echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 3: Login registry ----------------------\n"

echo $PASS_DOCKER_HUB | docker login -u $USER_DOCKER_HUB --password-stdin

if [ ! $? -eq 0 ]
then
    echo -e "\nError: Login error.\n"
    exit 1
fi
echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 4: Push image to docker hub ----------------------\n"
docker tag template-api-build kaitoryouga/template-api-api
docker push kaitoryouga/template-api-api 
if [ ! $? -eq 0 ]
then
    echo -e "\nError: Build image error.\n"
    exit 1
fi
echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 5: Copy replace-container.sh to tmp ----------------------\n"

mkdir /tmp/dist
docker cp template-api-build:/usr/src/app/replace-container.sh /tmp/dist

if [ ! -f /tmp/dist/replace-container.sh ]
then
    echo -e "\nError: Copy replace-container.sh to tmp error.\n"
    exit 1
fi

echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 6: Copy dist from local to server ----------------------\n"

echo -n "Password: "
read -s Password

echo -e "\nCopy file to server ..."

sshpass -p $Password scp -r /tmp/dist $USER@$SERVER:$PATH_SERVER

STATUS_CHECK_DIST=$(sshpass -p $Password ssh $USER@$SERVER "if [ -d $PATH_SERVER/dist ]; then echo 1; else echo 0; fi")

if [ $STATUS_CHECK_DIST -eq 0 ]
then
    echo -e "\nError: Copy dist to server error.\n"
    exit 1
fi

echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 7: Pull image ----------------------\n"

sshpass -p $Password ssh $USER@$SERVER "chmod +x $PATH_SERVER/dist/replace-container.sh && $PATH_SERVER/dist/replace-container.sh"

echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 8: Clear tmp ----------------------\n"

rm -Rf /tmp/dist

echo -e "\n----------------- End ----------------------\n"