#!/bin/bash

docker cp /tmp/dist template-api_api_1:/usr/src/app
docker restart template-api_api_1