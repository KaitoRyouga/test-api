#!/bin/bash

docker build -f Dockerfile.dev -t template-api_api_1 .
docker tag template-api_api_1  kaitoryouga/template-api-api
docker push kaitoryouga/template-api-api