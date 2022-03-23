#!/bin/bash

SERVER=194.233.76.255
FILENAME='internal-dist.txt'
PATH_SERVER=/tmp
USER=root

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

echo -e "\n----------------- Step 3: Copy dist to tmp ----------------------\n"
docker cp template-api-build:/usr/src/app/dist /tmp/dist
if [ ! -d /tmp/dist ]; then
    echo -e "\nError: Copy dist to tmp error.\n"
    exit 1
fi
echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 4: Copy other file/folder to dist ----------------------\n"

while read line; do
docker cp template-api-build:/usr/src/app/$line /tmp/dist
if [[ ! -f /tmp/dist/$line && ! -d /tmp/dist/$line ]]
then
    echo -e "\nError: Copy $line to dist error.\n"
    exit 1
fi
done < $FILENAME

echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 5: Copy dist from local to server ----------------------\n"

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

echo -e "\n----------------- Step 6: Copy to container ----------------------\n"

sshpass -p $Password ssh $USER@$SERVER "chmod +x $PATH_SERVER/dist/run-container.sh && $PATH_SERVER/dist/run-container.sh"

echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 7: Clear tmp ----------------------\n"

rm -Rf /tmp/dist

echo -e "\n----------------- End ----------------------\n"