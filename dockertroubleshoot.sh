sudo apt-get remove docker
sudo dockerd
sudo ln -s /mnt/c/Program\ Files/Docker/Docker/resources/bin/docker.exe /usr/bin/docker
sudo cp docker/* /usr/bin/
sudo dockerd &
