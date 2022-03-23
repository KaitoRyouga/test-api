#!/bin/bash

SERVER=194.233.76.255
FILENAME='internal-dist.txt'
PATH_SERVER=/tmp
USER=root

echo -e "\n----------------- Step 1: Build dist ----------------------\n"
npm run build    
if [ ! $? -eq 0 ]
then
    echo -e "\nError: Build dist error.\n"
    exit 1
fi
echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 2: Copy dist to tmp ----------------------\n"

cp -R dist /tmp
if [ ! -d /tmp/dist ]; then
    echo -e "\nError: Copy dist to tmp error.\n"
    exit 1
fi

echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 3: Copy other file/folder to dist ----------------------\n"

while IFS= read -r line
do
cp $line /tmp/dist
if [[ ! -f /tmp/dist/$line && ! -d /tmp/dist/$line ]]
then
    echo -e "\nError: Copy $line to dist error.\n"
    exit 1
fi
done < $FILENAME

echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 4: Copy dist from local to server ----------------------\n"

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

echo -e "\n----------------- Step 5: Copy to container ----------------------\n"

sshpass -p $Password ssh $USER@$SERVER "chmod +x $PATH_SERVER/dist/run-container.sh && $PATH_SERVER/dist/run-container.sh"

echo -e "\n----------------- End ----------------------\n"

echo -e "\n----------------- Step 6: Clear tmp ----------------------\n"

rm -Rf /tmp/dist

echo -e "\n----------------- End ----------------------\n"