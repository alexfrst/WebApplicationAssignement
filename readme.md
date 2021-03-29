# Project assignement web applications course

Hello sir please find in the current github folder my assignement for the web application course
I've worked on the folowing assignements:
* Assignement 1: Static local canvas image saver (5 points)
* Assignement 2: Dynamic canvas image saver on server (10 points)
* Assignement 3: Movie DB query project

# Assignement 1 & 2:
Let's first talk about assignement 1 and 2 together as they are closely matched to each other

For this assignement both pages are are available thanks to these two links ([drawing page](https://testwebappcourse.herokuapp.com/whiteboard) and [gallery page](https://testwebappcourse.herokuapp.com/gallery)) 

The folder 1 contains the white board drawing page

The folder 2 contains the gallery page

**Remember that to be able to draw or see the others drawing you must be logged in**

This part of the project includes some dependencies to get a better results, but most of the actions are being done manually using vanilla JS


## Client side
On the client side:
- I've only imported **the icon library** of bootstrap to get some nice visuals
- I use some fonts downloaded from google fonts cdn
- Of course I use socket.io

As you told me during the last session I've had a look at the flex box layout as I'm not really accustomed to this type of rendering if you have an exotic screen ratio the rendering may not work perfectly
 
## Server side
On the server side i only use common Node.js modules:
- body-parser
- express
- mongodb
- socket.io

As you will see I've worked on the file uploading using only vanilla JS as a result you may not draw too much line as the request payload may become too heavy but do not worry if this happens the console will tell you that the upload has failed

# Assignement 3

# Deployement

The app is deployed on heroku the only difference with what we've seen during the course is that I rely on a Mongo DB atlas instance for the database instead of using a single docker deployement on heroku
![](blob/deploy.png)


