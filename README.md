# ReplayDownloader
A Variation to node-dota2 to Automatically download replays for the game Dota 2.

Based off this version:
https://github.com/RJacksonm1/node-dota2/tree/5806e4a54eb6bd19aaf1a547bb01a38505d71daf

To run this, do 'node index.js' on the file in dota2/test. Overall a bit hacky, it works but it needs a lot of cleaning up. 

To set up, you will need to create a second steam account, and friend it with your main account. I recomend turning off Steam Guard for the new account. I haven't fully fleshed out authorization with dropbox, and what I have been using up till now is a Developer App with a Generated access token. 

To set up everything, rename the config_SAMPLE to config, and fill in the fields with the info you need.

The program has a tendency to crash when steam is having network issues, so I recommend having something to automatically start it back up if it crashes, like Forever.

Edit: Some notes about setting everything up.

Uses node 0.10.25

Uses node-steam 0.6.7

Uses bignumber.js 2.0.0



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
