var Dota2 = require("../index"),
    merge = require("merge")
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    dota_gcmessages_client = new Schema(fs.readFileSync(__dirname + "/../generated/dota_gcmessages_client.desc")),
	dota_gcmessages_common = new Schema(fs.readFileSync(__dirname+"/../generated/dota_gcmessages_common.desc")),
    protoMask = 0x80000000;

//DB Stuff
var fs = require("fs");
var file = "match.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

//File Download stuff
var http = require('http');
var fs = require('fs');
var Bunzip = require('seek-bzip');
var request = require('request');

//A pointer to the correct object, to fix an issue I was having with making subsequent function calls
var callbackRoute;

db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE matchLog (matchID BIGINT, downloaded int, availability TEXT)");
  }
 });	

 
// Methods

//Function will recurrently call its self each hour to check new games 
Dota2.Dota2Client.prototype.initalizeCallBack = function()
{
	callbackRoute = this;
}


Dota2.Dota2Client.prototype.processMatches = function(matchArray)
{
	callbackRoute = this;
	for (var i in matchArray) 
		{
			//Check to see if the replay has been downloaded or already confirmed to be expried
			//util.log(matchArray[i]);
			db.get("select '"+ matchArray[i] + "' as theMatchID, count(*) as rowCount from matchLog where matchID = "+ matchArray[i]+ " and (downloaded = 1 or availability = 'REPLAY_EXPIRED')",this.checkMatches);
		}
}

Dota2.Dota2Client.prototype.checkMatches = function(err, rows)
{
	if(err !== null) 
	{
		console.log(err);
	}
	else
	{	//If the row count is 0, the replay has not been downloaded and should be available
		//util.log("Match ID " + rows.rowCount);
		if (rows.rowCount == 0)
		{
			callbackRoute.matchDetailsRequest(rows.theMatchID,callbackRoute.downloadMatch);
		}
	}
}

Dota2.Dota2Client.prototype.downloadMatch = function(replayURL,infoCode,matchID)
{
	if (infoCode == "REPLAY_EXPIRED")
	{
		db.run("INSERT INTO matchLog (matchID, downloaded, availability) values (?,0,'REPLAY_EXPIRED')",matchID);
	}
	else if (infoCode == "REPLAY_NOT_RECORDED")
	{
		// Is this a fail state? I'm pretty sure this just means I can't download it yet, not that it can't be downloaded.
	}
	//Download Replay
	else
	{
		var fileName = matchID + ".dem.bz2";
		util.log("Trying to download file " + fileName);
		var download = fs.createWriteStream(fileName);
		var request = http.get(replayURL, function(response) 
		{
			response.pipe(download);
			download.on('finish', function() 
			{
				db.run("INSERT INTO matchLog (matchID, downloaded, availability) values (?,1,'REPLAY_AVALIABLE')",matchID);
				download.close(function() // close() is async, call cb after close completes.
				{
					//Uncompress File and save it
					var compressedData = fs.readFileSync(fileName);
					var data = Bunzip.decode(compressedData);
					
					//This line would save it locally, but we are just going to upload it instead
					//fs.writeFileSync(matchID + ".dem", data);
					
					//Uploads file to dropbox. First parma in an OAuth2 key. Here, we have it hard coded to be the key to my dropbox account. Second is the data, third is a file name. 
					fileupload("bgPNnVN3Z1gAAAAAAAAGHrRi3NP06mRy1vx5ZTJAhLMjLCTG6S89mGqNmVQDnO8Q",data,matchID+".dem");
				});  
			});
		});
		util.log(replayURL);
	}
}

function fileupload(token,content,serverpath){
    request.put('https://api-content.dropbox.com/1/files_put/auto/'+serverpath, {
    headers: { Authorization: 'Bearer ' + token ,  'Content-Type': 'text/plain'
    },body:content}, function optionalCallback (err, httpResponse, bodymsg) {
    if (err) {
        console.log(err);
    }
    else
    { 
        //console.log(bodymsg);
		console.log("Uploaded file " + serverpath + " to dropbox.");
		
		//Deletes files, since it has been uploaded
		fs.unlink(serverpath+".bz2");
    }
});
}

