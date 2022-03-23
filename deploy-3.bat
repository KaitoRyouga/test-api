docker build -t template-api-build .
docker cp template-api-build:/usr/src/app/dist template-api-api-1:/usr/src/app/dist
docker restart template-api-api-1