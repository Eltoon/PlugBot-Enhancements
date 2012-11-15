/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * TERMS OF REPRODUCTION USE
 *
 * 1. Provide a link back to the original repository (this repository), as
 * 		in, https://github.com/ConnerGDavis/Plugbot, that is well-visible
 * 		wherever the source is being reproduced.  For example, should you 
 * 		display it on a website, you should provide a link above/below that
 *		which the users use, titled something such as "ORIGINAL AUTHOR".  
 *
 * 2. Retain these three comments:  the GNU GPL license statement, this comment,
 * 		and that below it, that details the author and purpose.
 */
 
/**
 * NOTE:  This is all procedural as hell because prototypes and any 
 * 			OOP techniques in Javascript are stupid and confusing.
 * 
 * Original author 	Conner Davis ([VIP] ?Log���) 
 * 			Harrison Schneidman ([VIDJ] EX?)
 *
 *
 * Enhanced version author  Jeremy Richardson ([Colgate])
 */
var version = "Running RainDasher's Fork of Colgate's Plugbot Enhancements version 1.0.2";


appendToChat(version, null, "#66ffff");
appendToChat("Use '/commands' to see expanded chat commands.",null,"#66FFFF")
var recent = false;
var awaymsg;
var autowoot = true;
var autoqueue = false;
var hideVideo = false;
var userList = true;
var autorespond = false;
var afkdisable = false;
var menu = false;

/*API listeners*/
function initAPIListeners() {
API.addEventListener(API.DJ_ADVANCE, djAdvanced);
API.addEventListener(API.VOTE_UPDATE, function(obj) {
	if (userList)
		populateUserlist();});
API.addEventListener(API.CURATE_UPDATE, function(obj) {
	appendToChat(obj.user.username + " added " + media.author + " - " + media.title, null, "#00FF00");
	if (userList)
		populateUserlist();});
API.addEventListener(API.USER_JOIN, function(user) {
	appendToChat(user.username + " joined the room", null, "#3366FF");
	if (userList)
		populateUserlist();});
API.addEventListener(API.USER_LEAVE, function(user) {
	appendToChat(user.username + " left the room", null, "#3366FF");
	if (userList)
		populateUserlist();});
API.addEventListener(API.CHAT, disable);
API.addEventListener(API.CHAT,usercommands);
}

/*ui*/
function displayUI() {
	$('#plugbot-ui').remove();
	$('#user-container').prepend('<div id="plugbot-ui"></div>');
	$('#plugbot-ui').append(
			'<p id="plugbot-btn-menu" style="color:#FFFFFF">PlugBOT</p>'
		+	'<div style="visibility:hidden">'
		+	'<p id="plugbot-btn-woot" style="color:#3FFF00";>autowoot</p>'
		+ 	'<p id="plugbot-btn-queue" style="color:#ED1C24">autojoin</p>'
		+ 	'<p id="plugbot-btn-hidevideo" style="color:#ED1C24">hide video</p>'
		+ 	'<p id="plugbot-btn-userlist" style="color:#3FFF00">userlist</p>'
		+	'<p id="plugbot-btn-autorespond" style="color:#ED1C24">afk status</p>'	
		+	'<p id="plugbot-btn-autogreet" style="color:#ED1C24">autogreet</p>'
		+	'</div>'
		);
}

/*ui listeners*/
function initUIListeners() {	
	$("#plugbot-btn-menu").on("click", function() {
		menu = !menu;
		$("#plugbot-btn-woot").css("visibility", menu ? ("visible") : ("hidden"));
		$("#plugbot-btn-queue").css("visibility", menu ? ("visible") : ("hidden"));
		$("#plugbot-btn-hidevideo").css("visibility", menu ? ("visible") : ("hidden"));
		$("#plugbot-btn-userlist").css("visibility", menu ? ("visible") : ("hidden"));
		$("#plugbot-btn-autorespond").css("visibility", menu ? ("visible") : ("hidden"));
	});
	$("#plugbot-btn-userlist").on("click", function() {
		userList = !userList;
		$(this).css("color", userList ? "#3FFF00" : "#ED1C24");
		$("#plugbot-userlist").css("visibility", userList ? ("visible") : ("hidden"));
		if (!userList) {
			$("#plugbot-userlist").empty();} 
			else {populateUserlist();}
	});
	$("#plugbot-btn-woot").on("click", function() {
		autowoot = !autowoot;
		$(this).css("color", autowoot ? "#3FFF00" : "#ED1C24");
		if (autowoot)
			$("#button-vote-positive").click();
	});
	$("#plugbot-btn-hidevideo").on("click", function() {
		hideVideo = !hideVideo;
		$(this).css("color", hideVideo ? "#3FFF00" : "#ED1C24");
		$("#yt-frame").animate({"height": (hideVideo ? "0px" : "271px")}, {duration: "fast"});
		$("#playback .frame-background").animate({"opacity": (hideVideo ? "0" : "0.91")}, {duration: "medium"});
	});
	$("#plugbot-btn-queue").on("click", function() {
		autoqueue = !autoqueue;
		$(this).css("color", autoqueue ? "#3FFF00" : "#ED1C24");
		$("#button-dj-waitlist-" + (autoqueue ? "join" : "leave")).click();
	});
	$("#plugbot-btn-autorespond").on("click", function() {
		autorespond = !autorespond;
		$(this).css("color", autorespond ? "#3FFF00" : "#ED1C24");
			if (!autorespond){
				API.removeEventListener(API.CHAT,chat);
				Models.user.changeStatus("0");}
			else {
				awaymsg = prompt("Enter custom away message here. Should start with /me.","/me is away from keyboard.");
				Models.user.changeStatus("1");
				API.addEventListener(API.CHAT,chat);}
	});
}
/*On DJ Change/Room update*/
function djAdvanced(obj) {
	if (hideVideo) {
		$("#yt-frame").css("height", "0px");
		$("#playback .frame-background").css("opacity", "0.0");
	}
	if (autowoot) 
		$("#button-vote-positive").click();
	if ($("#button-dj-waitlist-join").css("display") === "block" && autoqueue)
		$("#button-dj-waitlist-join").click();
	if (userList)
		populateUserlist();
}

/*Userlist Generation*/
function populateUserlist() {
	$("#plugbot-userlist").remove();
	$('body').append('<div id="plugbot-userlist"></div>');
	$('#plugbot-userlist').append('<h1 style="text-indent:12px;color:#42A5DC;font-size:14px;font-variant:small-caps;">Users: ' + API.getUsers().length + '</h1>');
	if ($('#button-dj-waitlist-view').attr('title') !== '') {
		if ($('#button-dj-waitlist-leave').css('display') === 'block' && ($.inArray(API.getDJs(), API.getSelf()) == -1)) {
			var spot = $('#button-dj-waitlist-view').attr('title').split('(')[1];
				spot = spot.substring(0, spot.indexOf(')'));
			$('#plugbot-userlist').append('<h1 id="plugbot-queuespot"><span style="font-variant:small-caps">Waitlist:</span> ' + spot + '</h3><br />');
		}
	}
	var users = new Array();
	for (user in API.getUsers()){users.push(API.getUsers()[user]);}
	for (user in users) {
		var user = users[user];
		appendUser(user)
	}
}

/*Userlist Creation*/
function appendUser(user) {
	var username 	= user.username;
	var vote 		= user.vote;
	var colour;
	var currentDj = false;
	var moderator = user.moderator;
	if (API.getSuperUsers() != null) 	var su = user.superuser;
	if (API.getHost() != null) 			var host = user.owner;
	var img;
	switch (vote) {
		case 1:		// WOOT!
			colour = "3FFF00";
			if (moderator)
				img = "http://i.imgur.com/T5G4f.png";
			if (host)
				img = "http://i.imgur.com/Lu1qo.png";
			if (su)
				img = "http://i.imgur.com/XA1DE.png";
			break;
		case 0:		// Undecided
			colour = "FFFFFF";
			if (moderator) 
				img = "http://i.imgur.com/sRsU0.png";
			if (host)
				img = "http://i.imgur.com/6Bq5W.png";
			if (su)
				img = "http://i.imgur.com/veoVS.png";
			break;
		case -1:	// Meh
			colour = "ED1C24";
			if (moderator)
				img = "http://i.imgur.com/JPA1Q.png";
			if (host)
				img = "http://i.imgur.com/wVLR3.png";
			if (su)
				img = "http://i.imgur.com/5LcI3.png";
			break;
	}
	if (API.getDJs().length > 0 && API.getDJs()[0].username == username) {
		currentDj = true;
		colour = "42A5DC";
		if (moderator)
			img = "http://i.imgur.com/CsK3d.png";
	}
	if (img == undefined && (moderator || host || su)) {
		colour = "FFFFFF";
		img = moderator ? "http://i.imgur.com/sRsU0.png" : "http://i.imgur.com/6Bq5W.png";
	}
	$('#plugbot-userlist').append(
		((moderator || host || su) ? '<img src="' + img + '" align="left" style="margin-left:6px" alt="Moderator" />' : '') 
		+ '<p style="' + ((moderator || host || su) ? 'text-indent:6px !important;' : '') 
		+ 'color:#' + colour + ';' + (currentDj ? 'font-weight:bold;font-size:15px' : '') + '"' 
		+ (currentDj ? ('title="' + username + ' is the current DJ!"') : '') + '>' 
		+ username + '</p>'
	);
}
//End Core
//Start Raindasher fork

// Volume mute
if(window.navigator.vendor.match(/Google/)) { 
  var div = document.createElement("div");
  div.setAttribute("onclick", "return window;");
  unsafeWindow = div.onclick();
};

function toggle(event){if (unsafeWindow.Playback.isMuted){
		setTimeout(function(){unsafeWindow.Playback.onSoundButtonClick()},2000)
	}
	unsafeWindow.API.removeEventListener(unsafeWindow.API.DJ_ADVANCE,toggle)
}

setTimeout(function() {
unsafeWindow.$('#volume').append("<div id='muteSong' style='position: absolute; top: 32px;border-style:solid; border-width:1px; padding: 1px; '> Mute this song</div>")
unsafeWindow.$('#muteSong').click(function(){
	unsafeWindow.Playback.onSoundButtonClick()

	unsafeWindow.API.addEventListener(unsafeWindow.API.DJ_ADVANCE, toggle)
	console.log('done')
})
},5000);

/*Colgate's Expansion past here*/
/*AppendToChat*/
function appendToChat(message, from, color, changeToColor){
    style = "";
    if (color){
        style = 'style="color:'+color+';"'
    }
    if (from){
        div = $('<div class="chat-message"><span class="chat-from" '+style+'>'+from+'</span><span class="chat-text" '+style+'>: '+message+'</span></div>')[0]
    } 
	else {
        div = $('<div class="chat-message"><span class="chat-text" '+style+' >'+message+'</span></div>')[0]
    }
    scroll = false;
    if ($("#chat-messages")[0].scrollHeight - $("#chat-messages").scrollTop() == $("#chat-messages").outerHeight()){
        scroll = true;
    }
    var curChatDiv;
    if (Popout){
        curChatDiv = Popout.Chat.chatMessages;
    } 
	else {
        curChatDiv = Chat.chatMessages;
    }
    var s=curChatDiv.scrollTop()>curChatDiv[0].scrollHeight-curChatDiv.height()-20;
    curChatDiv.append(div);
    if (s){
        curChatDiv.scrollTop(curChatDiv[0].scrollHeight);
    }
    
    if (changeToColor){
        $(div).click(function(e){
            this.childNodes[0].style.color = changeToColor;
        });
    }
    
}

/*ChatCommands*/
eval('Models.chat.chatCommand='+Models.chat.chatCommand.toString().replace(/return false/g, 'if(value.indexOf("/commands") === 0){appendToChat("User Commands",null,"#66FFFF");appendToChat("/nick - change username",null,"#66FFFF");appendToChat("/avail - set status available",null,"#66FFFF");appendToChat("/afk - set status afk",null,"#66FFFF");appendToChat("/work - set status working",null,"#66FFFF");appendToChat("/sleep - set status sleeping",null,"#66FFFF");appendToChat("/join - joins dj booth/waitlist",null,"#66FFFF");appendToChat("/leave - leaves dj booth/waitlist",null,"#66FFFF");appendToChat("/woot - woots current song",null,"#66FFFF");appendToChat("/.meh - mehs current song",null,"#66FFFF");appendToChat("/version - displays version number",null,"#66FFFF");appendToChat("/commands - shows this list",null,"#66FFFF");return true;}else{return false;};'));
eval('Models.chat.chatCommand='+Models.chat.chatCommand.toString().replace(/return false/g, 'if(value.indexOf("/avail") === 0){Models.user.changeStatus("0");return true;}else{return false;};'));
eval('Models.chat.chatCommand='+Models.chat.chatCommand.toString().replace(/return false/g, 'if(value.indexOf("/work") === 0){Models.user.changeStatus("2");return true;}else{return false;};'));
eval('Models.chat.chatCommand='+Models.chat.chatCommand.toString().replace(/return false/g, 'if(value.indexOf("/sleep") === 0){Models.user.changeStatus("3");return true;}else{return false;};'));
eval('Models.chat.chatCommand='+Models.chat.chatCommand.toString().replace(/return false/g, 'if(value.indexOf("/join") === 0){API.waitListJoin();return true;}else{return false;};'));
eval('Models.chat.chatCommand='+Models.chat.chatCommand.toString().replace(/return false/g, 'if(value.indexOf("/leave") === 0){API.waitListLeave();return true;}else{return false;};'));
eval('Models.chat.chatCommand='+Models.chat.chatCommand.toString().replace(/return false/g, 'if(value.indexOf("/woot") === 0){$("#button-vote-positive").click();return true;}else{return false;};'));
eval('Models.chat.chatCommand='+Models.chat.chatCommand.toString().replace(/return false/g, 'if(value.indexOf("/.meh") === 0){$("#button-vote-negative").click();return true;}else{return false;};'));
eval('Models.chat.chatCommand='+Models.chat.chatCommand.toString().replace(/return false/g, 'if(value.indexOf("/version") === 0){appendToChat(version, null, "#FFFF00");return true;}else{return false;};'));

/*AFK Status*/
function chat(data){
if(RegExp("^@"+API.getSelf().username).exec(data.message)){
if(!recent){
API.sendChat(awaymsg);
recent = true;
setTimeout(function(){recent=false;},180000);
}
}
}

/*AutoJoin Disable*/
function disable(data){
if(Models.room.canModerate(data.fromID)){
if(RegExp("^@"+API.getSelf().username + " !disable").exec(data.message)){
if (autoqueue){
$("#plugbot-btn-queue").click();
setTimeout(function(){Dialog.closeDialog();},500);
API.waitListLeave();
API.sendChat("@" + data.from + " Autojoin disabled");
}
else{
API.sendChat("@" + data.from + " Autojoin was not enabled");
}
}
}
}

/*Other UserCommands*/
function usercommands(data){
if (data.fromID == API.getSelf().id){
if (/\/nick (.*)$/.exec(data.message)){
Models.user.changeDisplayName(RegExp.$1);
}
}
}

/*init*/
$('#plugbot-css').remove();
$('#plugbot-js').remove();
$('body').prepend('<style type="text/css" id="plugbot-css">' 
 	+ '#plugbot-ui { position: absolute; margin-left:-522px; top: -320px; }'
	+ '#plugbot-ui p { background-color: #0b0b0b; height: 32px; padding-top: 8px; padding-left: 8px; cursor: pointer; font-variant: small-caps; width: 84px; font-size: 15px; margin: 0; }'
	+ '#plugbot-ui h1 { background-color: #0b0b0b; height: 32px; padding-top: 8px; padding-left: 8px; cursor: pointer; font-variant: small-caps; width: 84px; font-size: 20px; margin: 0; }'
    + '#plugbot-userlist { border: 6px solid rgba(10, 10, 10, 0.8); border-left: 0 !important; background-color: #000000; padding: 8px 0px 20px 0px; width: 12%; }'
    + '#plugbot-userlist p { margin: 0; padding-top: 2px; text-indent: 24px; font-size: 10px; }'
    + '#plugbot-userlist p:first-child { padding-top: 0px !important; }'
    + '#plugbot-queuespot { color: #42A5DC; text-align: left; font-size: 15px; margin-left: 8px }');
$("#button-vote-positive").click();
initAPIListeners();
populateUserlist();
displayUI();
initUIListeners();