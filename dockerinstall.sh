sudp apt-get remove docker-ce
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=x64] https://download.docker.com/linux/ubuntu bionic test"
sudo apt update
sudo apt install docker-ce
