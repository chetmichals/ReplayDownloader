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

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();	
// Methods

Dota2.Dota2Client.prototype.checkNewBloom = function() {
  /* Attempts to join a chat channel.  Expect k_EMsgGCJoinChatChannelResponse from GC */
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Trying to Check New Bloom");
  var payload = dota_gcmessages_client.CMsgGCNewBloomModeState.serialize({
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCToGCUpdateIngameEventDataBroadcast | protoMask), payload);
};

/*
Dota2.Dota2Client.prototype.requestMatchDetails = function (matchID)
{
//Makes a request to the server for the details of the passed in match, to be decoded by another function
	if (!this._gcReady) {
		if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Trying to Get Match Details for Match " + matchID);
  var payload = dota_gcmessages_client.CMsgGCMatchDetailsRequest.serialize({
	  "matchId":matchID
  });

  this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgGCMatchDetailsRequest | protoMask), payload);

}	
	*/
	
//Handlers
	
var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgGCToClientNewBloomTimingUpdated] = function newBloomTestFunction(message, callback) {
    callback = callback || null;
	
	console.log("Sent Email");
	var response = dota_gcmessages_common.CMsgGCToClientNewBloomTimingUpdated.parse(message);
	/*

    var sourceTVGamesResponse = dota_gcmessages_client.CMsgSourceTVGamesResponse.parse(message);

    if (typeof sourceTVGamesResponse.games !== "undefined" && sourceTVGamesResponse.games.length > 0) {
        if (this.debug) util.log("Received SourceTV games data");
        if (callback) callback(sourceTVGamesResponse);
    }
    else {
        if (this.debug) util.log("Received a bad SourceTV games response");
        if (callback) callback(sourceTVGamesResponse.result, sourceTVGamesResponse);
    }
	*/
	
	console.log("New Bloom Info here?");
	console.log("Beast Active:" + response.isActive);
	console.log("Next Time:" + response.nextTransitionTime);
	console.log("Bonus Amount:" + response.bonusAmount);
	console.log("Stand By Time:" + response.standbyDuration);
	var myDate = new Date(Number(response.nextTransitionTime)*1000);
	var December2015 = new Date(1448928000 * 1000);
	
	var outputText = "Beast Active: " + response.isActive + " Next Time: " + myDate.toLocaleString() + "EST " + " Bonus Amount: " + response.bonusAmount;
	
	if (December2015.getTime() > myDate.getTime()) //The server will output the time as January 2016 to push updates to the daily bonus, don't want to report this
	{
		transporter.sendMail({
		from: 'YearBeastInfo@dotahatstats.com',
		to: 'email@gmail.com, phonenumber@tmomail.net',
		subject: 'Year Beast Status',
		text: outputText
		});
		console.log("Sent Email");
	}
	
	  
};