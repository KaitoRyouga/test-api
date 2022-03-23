#!/bin/bash

docker pull kaitoryouga/template-api-api
docker rm -f template-api_api_1
docker run --name template-api_api_1 -d -p 3010:3009 kaitoryouga/template-api-api