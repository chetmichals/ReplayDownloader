# node-dota2
A Variation to the node-dota2 to track the New Bloom Year Beast 

Based off this version:
https://github.com/RJacksonm1/node-dota2/tree/5806e4a54eb6bd19aaf1a547bb01a38505d71daf

To run this, do 'node index.js' on the file in dota2/test. 

The gist of this program is that it listens for the message indicating the Year Beast's timing has changed, decodes it, and sends an email and text message alerting that the next year beast fight is coming. Its sloppy and was put together hastily, but the even is only up for 2 weeks so I just wanted something that works now. 


Edit: Some notes about setting everything up.

Uses node-steam 0.6.7

Uses bignumber.js 2.0.0

Uses node 0.10.25

On Unbutu, the following is how you install.

sudo apt-get update

sudo apt-get install nodejs

sudo apt-get install npm


Then make a Symbolic link with the following

sudo update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10

Uses the following packages
nodemailer

sqlite

seek-bzip
