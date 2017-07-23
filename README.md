# Company
To run this project you will need to:

1. Install MongoDB

- First we’ll import the MongoDB public key used by the package management system:

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

- Then we’ll create a list file for MongoDB:

echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list

- Now reload the package database:

sudo apt-get update

- At this point, installing MongoDB is as simple as running just one command:

sudo apt-get install -y mongodb-org

- Start MongoDB

sudo service mongod start

2. Install All Packages

cd to project folder

npm install

3. Run project

node server

4. Go to http://localhost:5000/
