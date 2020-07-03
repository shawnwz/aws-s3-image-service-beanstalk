# aws-s3-image-service-beanstalk
this is a nodejs project comply with aws beanstalk protocal.
A backend service to upload image to aws s3 and resize image on the fly.
you can test it by postman.

---
## Requirements

For development, you need Node.js and npm installed in your environement.
also please install Elastic Beanstalk Command Line Interface (EB CLI)   
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.18.1

    $ npm --version
    6.14.5

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

---

## Install

    $ git clone git@github.com:shawnwz/aws-s3-image-service-beanstalk.git
    $ cd aws-s3-image-service-beanstalk
    $ npm install

## Configure app

create and open `.env` then edit it with your settings. You will need:

      ACCESS_KEY_ID=xxxxxxxxxx
      SECRET_ACCESS_KEY=xxxxxxxxxx
      REGION=us-east-1
      BUCKET_NAME=xxxxxxxxxx
      PORT=3000

## Running the project

    $ npm start

## Simple build for production

    $ eb deploy
    
## Test with PostMan
    Upload:
      POST:  http://yourpath.elasticbeanstalk.com/api/upload
        in the body must has a KEY named folder indicates the upload folder
        mush has a KEY named image1 (file) indicates the first image
        optional has a KEY named image2 (file) the second image
    GET/resize the image
      GET:  http://yourpath.elasticbeanstalk.com/api/get/thename.png?width=200
      this will return resized image binary.
     
