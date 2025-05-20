echo “Setting db container”

cd docker-volumes/db_volume/

docker build -t clocker-db .

docker run -d -p 3306:3306 clocker-db

cd ../..

echo “Installing backend dependences”

npm install