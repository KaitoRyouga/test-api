docker build -f Dockerfile.dev -t template-api-api-1 .
docker tag template-api-api-1  kaitoryouga/template-api-api
docker push kaitoryouga/template-api-api