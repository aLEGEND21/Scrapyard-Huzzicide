echo building docker containers
sudo docker-compose build

echo killing old docker processes
sudo docker-compose kill

echo starting docker containers
sudo docker-compose up -d