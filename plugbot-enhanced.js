/*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/*
* TERMS OF REPRODUCTION USE
*
* 1. Provide a link back to the original repository (this repository), as
* in, https://github.com/ConnerGDavis/Plugbot, that is well-visible
* wherever the source is being reproduced. For example, should you
* display it on a website, you should provide a link above/below that
* which the users use, titled something such as "ORIGINAL AUTHOR".
*
* 2. Retain these three comments: the GNU GPL license statement, this comment,
* and that below it, that details the author and purpose.
*/

/**
 * NOTE: This is all procedural as hell because prototypes and any
 * OOP techniques in Javascript are stupid and confusing.
 *
 * Original author Conner Davis ([VIP] ?Log??)
 * Harrison Schneidman ([VIDJ] EX?)
 *
 *
 * Enhanced version author Jeremy Richardson ([Colgate])
 * Thomas Andresen ([TAT])
 */
var version = "Running Raindasher's fork of colgates Plugbot Enhancements version 1.0.8";


appendToChat(version, null, "#66FFFF");
appendToChat("Use '/commands' to see expanded chat commands.", null, "#66FFFF");
var recent = false,
    awaymsg = "",
    autowoot = true,
    autoqueue = false,
    hideVideo = false,
    userList = true,
    autorespond = false,
    afkdisable = false,
    menu = false,
    notify = true;

/*API listeners*/

function initAPIListeners() {
    API.addEventListener(API.DJ_ADVANCE, djAdvanced);
    API.addEventListener(API.VOTE_UPDATE, function(obj) {
        if (userList) populateUserlist();
    });
    API.addEventListener(API.CURATE_UPDATE, function(obj) {
        var media = API.getMedia();
        appendToChat(obj.user.username + " added " + media.author + " - " + media.title, null, "#00FF00");
        API.getUser(obj.user.id).curated = true;
        if (userList) populateUserlist();
    });
    API.addEventListener(API.USER_JOIN, function(user) {
        if (notify == true) {
            appendToChat(user.username + " joined the room", null, "#3366FF");
        }
        if (userList) populateUserlist();
    });
    API.addEventListener(API.USER_LEAVE, function(user) {
        if (notify == true) {
            appendToChat(user.username + " left the room", null, "#3366FF");
        }
        if (userList) populateUserlist();
    });
    API.addEventListener(API.CHAT, disable);
}

/*ui*/

function displayUI() {
    $('#plugbot-ui').remove();
    $('#user-container').prepend('<div id="plugbot-ui"></div>');
    $('#plugbot-ui').append('<p id="plugbot-btn-menu" style="color:#FFFFFF">PlugBOT</p>' + '<div style="visibility:hidden">' + '<p id="plugbot-btn-woot" style="color:#3FFF00";>autowoot</p>' + '<p id="plugbot-btn-queue" style="color:#ED1C24">autojoin</p>' + '<p id="plugbot-btn-hidevideo" style="color:#ED1C24">hide video</p>' + '<p id="plugbot-btn-userlist" style="color:#3FFF00">userlist</p>' + '<p id="plugbot-btn-autorespond" style="color:#ED1C24">afk status</p>' + '<p id="plugbot-btn-autogreet" style="color:#ED1C24">autogreet</p>' + '</div>');
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
        if (!userList) $("#plugbot-userlist").empty();
        else populateUserlist();
    });
    $("#plugbot-btn-woot").on("click", function() {
        autowoot = !autowoot;
        $(this).css("color", autowoot ? "#3FFF00" : "#ED1C24");
        if (autowoot) $("#button-vote-positive").click();
    });
    $("#plugbot-btn-hidevideo").on("click", function() {
        hideVideo = !hideVideo;
        $(this).css("color", hideVideo ? "#3FFF00" : "#ED1C24");
        $("#yt-frame").animate({
            "height": (hideVideo ? "0px" : "271px")
        }, {
            duration: "fast"
        });
        $("#playback .frame-background").animate({
            "opacity": (hideVideo ? "0" : "0.91")
        }, {
            duration: "medium"
        });
    });
    $("#plugbot-btn-queue").on("click", function() {
        autoqueue = !autoqueue;
        $(this).css("color", autoqueue ? "#3FFF00" : "#ED1C24");
        $("#button-dj-waitlist-" + (autoqueue ? "join" : "leave")).click();
    });
    $("#plugbot-btn-autorespond").on("click", function() {
        autorespond = !autorespond;
        $(this).css("color", autorespond ? "#3FFF00" : "#ED1C24");
        if (!autorespond) {
            API.removeEventListener(API.CHAT, chat);
            Models.user.changeStatus("0");
        } else {
            awaymsg = prompt("Enter custom away message here. Should start with /me.", "/me is away from keyboard.");
            Models.user.changeStatus("1");
            API.addEventListener(API.CHAT, chat);
        }
    });
} /*On DJ Change/Room update*/

function djAdvanced(obj) {
    setTimeout(function() {
        if (hideVideo) {
            $("#yt-frame").css("height", "0px");
            $("#playback .frame-background").css("opacity", "0.0");
        }
        if (autowoot) {
            var dj = API.getDJs()[0];
            if (dj === null) return;
            if (dj == API.getSelf()) return;
            $('#button-vote-positive').click();
        }
        if ($("#button-dj-waitlist-join").css("display") === "block" && autoqueue) $("#button-dj-waitlist-join").click();
    }, 3000);
    if (userList) populateUserlist();
    API.sendChat("/woot");
}

/*Userlist Generation*/
<div id="container">            

    <div id = "information">
    </div>
    #container {
    overflow: auto;
}
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
    var users = API.getUsers();
    for (var i in users) {
        var user = users[i];
        appendUser(user);
    }
}
</div>
/*Userlist Creation*/

function appendUser(user) {
    var username = user.username,
        vote = user.vote,
        bouncer = false,
        manager = false,
        cohost = false,
        host = false,
        ambassador = false,
        admin = false,
        currentDj = false;

    var colour;
    if (Models.room.data.staff[user.id] && Models.room.data.staff[user.id] == Models.user.BOUNCER) bouncer = true;
    else if (Models.room.data.staff[user.id] && Models.room.data.staff[user.id] == Models.user.MANAGER) manager = true;
    else if (Models.room.data.staff[user.id] && Models.room.data.staff[user.id] == Models.user.COHOST) cohost = true;
    else if (Models.room.data.staff[user.id] && Models.room.data.staff[user.id] == 5) host = true;
    else if (Models.room.ambassadors[user.id]) ambassador = true;
    else if (Models.room.admins[user.id]) admin = true;

    var img;
    switch (vote) {
    case 1:
        // WOOT!
        colour = "3FFF00";
        if (bouncer) img = "https://dl.dropbox.com/u/53727046/plugbot/bouncerwoot.png";
        if (manager) img = "http://i.imgur.com/T5G4f.png";
        if (cohost || host) img = "http://i.imgur.com/Lu1qo.png";
        if (ambassador) img = "https://dl.dropbox.com/u/53727046/plugbot/ambassadorwoot.png";
        if (admin) img = "http://i.imgur.com/XA1DE.png";
        break;
    case 0:
        // Undecided
        colour = "FFFFFF";
        if (bouncer) img = "https://dl.dropbox.com/u/53727046/plugbot/bouncerundecided.png";
        if (manager) img = "http://i.imgur.com/sRsU0.png";
        if (cohost || host) img = "http://i.imgur.com/6Bq5W.png";
        if (ambassador) img = "https://dl.dropbox.com/u/53727046/plugbot/ambassadorundecided.png";
        if (admin) img = "http://i.imgur.com/veoVS.png";
        break;
    case -1:
        // Meh
        colour = "ED1C24";
        if (bouncer) img = "https://dl.dropbox.com/u/53727046/plugbot/bouncermeh.png";
        if (manager) img = "http://i.imgur.com/JPA1Q.png";
        if (cohost || host) img = "http://i.imgur.com/wVLR3.png";
        if (ambassador) img = "https://dl.dropbox.com/u/53727046/plugbot/ambassadormeh.png";
        if (admin) img = "http://i.imgur.com/5LcI3.png";
        break;
    }
    if (API.getDJs().length > 0 && API.getDJs()[0].username == username) {
        currentDj = true;
        colour = "42A5DC";
        if (manager) img = "http://i.imgur.com/CsK3d.png";
    }
    if (img === undefined && (bouncer || manager || cohost || host || ambassador || admin)) {
        colour = "FFFFFF";
        img = manager ? "http://i.imgur.com/sRsU0.png" : "http://i.imgur.com/6Bq5W.png";
    }
    $('#plugbot-userlist').append(((bouncer || manager || cohost || host || ambassador || admin) ? '<img src="' + img + '" align="left" style="margin-left:6px" alt="Moderator" />' : '') + '<p style="' + ((bouncer || manager || cohost || host || ambassador || admin) ? 'text-indent:6px !important;' : '') + 'color:#' + colour + ';' + (currentDj ? 'font-weight:bold;font-size:15px' : '') + '"' + (currentDj ? ('title="' + username + ' is the current DJ!"') : '') + '>' + username + '</p>');
}


/*End of PlugBot Core - Colgate's Expansion past here*/

/*AppendToChat*/

function appendToChat(message, from, color, changeToColor) {
    style = "";
    if (color) style = 'style="color:' + color + ';"';
    if (from) div = $('<div class="chat-message"><span class="chat-from" ' + style + '>' + from + '</span><span class="chat-text" ' + style + '>: ' + message + '</span></div>')[0];
    else div = $('<div class="chat-message"><span class="chat-text" ' + style + ' >' + message + '</span></div>')[0];
    scroll = false;
    if ($("#chat-messages")[0].scrollHeight - $("#chat-messages").scrollTop() == $("#chat-messages").outerHeight()) scroll = true;
    var curChatDiv = Popout ? Popout.Chat.chatMessages : Chat.chatMessages;
    var s = curChatDiv.scrollTop() > curChatDiv[0].scrollHeight - curChatDiv.height() - 20;
    curChatDiv.append(div);
    if (s) curChatDiv.scrollTop(curChatDiv[0].scrollHeight);

    if (changeToColor) {
        $(div).click(function(e) {
            this.childNodes[0].style.color = changeToColor;
        });
    }
}

/*ChatCommands*/
var customChatCommand = function(value) {
    if (Models.chat._chatCommand(value) === true) return true;
    if (value.indexOf("/commands") === 0) {
        appendToChat("User Commands", null, "#66FFFF");
        appendToChat("/nick - change username", null, "#66FFFF");
        appendToChat("/avail - set status available", null, "#66FFFF");
        appendToChat("/afk - set status afk", null, "#66FFFF");
        appendToChat("/work - set status working", null, "#66FFFF");
        appendToChat("/sleep - set status sleeping", null, "#66FFFF");
        appendToChat("/join - joins dj booth/waitlist", null, "#66FFFF");
        appendToChat("/leave - leaves dj booth/waitlist", null, "#66FFFF");
        appendToChat("/woot - woots current song", null, "#66FFFF");
        appendToChat("/meh - mehs current song", null, "#66FFFF");
        appendToChat("/alertsoff - turns user join/leave messages off", null, "#66FFFF");
        appendToChat("/alertson - turns user join/leave messages on", null, "#66FFFF");
        appendToChat("/version - displays version number", null, "#66FFFF");
        appendToChat("/commands - shows this list", null, "#66FFFF");
        if (Models.room.data.staff[API.getSelf().id] && Models.room.data.staff[API.getSelf().id] > 0) {
            appendToChat("Moderation Commands", null, "#FF0000");
            appendToChat("/skip - skip current song", null, "#FF0000");
            appendToChat("/kick (username) - kicks targeted user", null, "#FF0000");
            appendToChat("/add (username) - adds targeted user to dj booth/waitlist", null, "#FF0000");
            appendToChat("/remove (username) - removes targeted user from dj booth/waitlist", null, "#FF0000");
        }
        return true;
    }
    if (value == "/avail" || value == "/available") {
        Models.user.changeStatus(0);
        return true;
    }
    if (value == "/brb" || value == "/away") {
        Models.user.changeStatus(1);
        return true;
    }
    if (value == "/work" || value == "/working") {
        Models.user.changeStatus(2);
        return true;
    }
    if (value == "/sleep" || value == "/sleeping") {
        Models.user.changeStatus(3);
        return true;
    }
    if (value.indexOf("/join") === 0) {
        API.waitListJoin();
        return true;
    }
    if (value.indexOf("/leave") === 0) {
        API.waitListLeave();
        return true;
    }
    if (value.indexOf("/woot") === 0) {
        $("#button-vote-positive").click();
        return true;
    }
    if (value.indexOf("/meh") === 0) {
        $("#button-vote-negative").click();
        return true;
    }
    if (value.indexOf("/skip") === 0) {
        new ModerationForceSkipService();
        return true;
    }
    if (value.indexOf("/version") === 0) {
        appendToChat(version, null, "#FFFF00");
        return true;
    }
    if (/\/nick (.*)$/.exec(value)) {
        Models.user.changeDisplayName(RegExp.$1);
        return true;
    }
    if (/^\/kick (.*)$/.exec(value)) {
        target = RegExp.$1;
        kick();
        return true;
    }
    if (/^\/remove (.*)$/.exec(value)) {
        target = RegExp.$1;
        removedj();
        return true;
    }
    if (/^\/add (.*)$/.exec(value)) {
        target = RegExp.$1;
        adddj();
        return true;
    }
    if (value.indexOf("/alertsoff") === 0) {
        if (notify == true) {
            appendToChat("Join/leave alerts disabled", null, "#FFFF00");
            notify = false;

        }
        return true;
    }
    if (value.indexOf("/alertson") === 0) {
        if (notify == false) {
            appendToChat("Join/leave alerts enabled", null, "#FFFF00");
            notify = true;
        }
        return true;
    }
    return false;
};



Models.chat._chatCommand = Models.chat.chatCommand;
Models.chat.chatCommand = customChatCommand;
ChatModel._chatCommand = ChatModel.chatCommand;
ChatModel.chatCommand = customChatCommand;

/*AFK Status*/

function chat(data) {
    if (data.type == "mention" && !recent) {
        API.sendChat(awaymsg);
        recent = true;
        setTimeout(function() {
            recent = false;
        }, 180000);
    }
}

/*AutoJoin Disable*/

function disable(data) {
    if (data.type == "mention" && Models.room.data.staff[data.fromID] && Models.room.data.staff[data.fromID] >= Models.user.BOUNCER && data.message.indexOf("!disable") > 0) {
        if (autoqueue) {
            API.sendChat("@" + data.from + " Nope.avi");
        }
        else API.sendChat("@" + data.from + " Autojoin was not enabled DERP");
    }
}

/*Moderation - Kick*/

function kick(data) {
    if (Models.room.data.staff[API.getSelf().id] && Models.room.data.staff[API.getSelf().id] > 0) {
        var usernames = [],
            id = [],
            users = API.getUsers();
        for (var i in users) {
            usernames.push(users[i].username);
            id.push(users[i].id);
        }
        if (usernames.indexOf(target) < 0) log("user not found");
        else {
            listlocation = usernames.indexOf(target);
            new ModerationKickUserService(id[listlocation], " ");
        }
    }
}

function removedj(data) {
    if (Models.room.data.staff[API.getSelf().id] && Models.room.data.staff[API.getSelf().id] > 1) {
        var usernames = [],
            id = [],
            users = API.getUsers();
        for (var i in users) {
            usernames.push(users[i].username);
            id.push(users[i].id);
        }
        if (usernames.indexOf(target) < 0) log("user not found");
        else {
            listlocation = usernames.indexOf(target);
            new ModerationRemoveDJService(id[listlocation]);
        }
    }
}

function adddj(data) {
    if (Models.room.data.staff[API.getSelf().id] && Models.room.data.staff[API.getSelf().id] > 1) {
        var usernames = [],
            id = [],
            users = API.getUsers();
        for (var i in users) {
            usernames.push(users[i].username);
            id.push(users[i].id);
        }
        if (usernames.indexOf(target) < 0) log("user not found");
        else {
            listlocation = usernames.indexOf(target);
            new ModerationAddDJService(id[listlocation]);
        }
    }
}


/*init*/
$('#plugbot-css').remove();
$('#plugbot-js').remove();
$('body').prepend('<style type="text/css" id="plugbot-css">' + '#plugbot-ui { position: absolute; margin-left:-522px; top: -320px; }' + '#plugbot-ui p { background-color: #0b0b0b; height: 32px; padding-top: 8px; padding-left: 8px; cursor: pointer; font-variant: small-caps; width: 84px; font-size: 15px; margin: 0; }' + '#plugbot-ui h1 { background-color: #0b0b0b; height: 32px; padding-top: 8px; padding-left: 8px; cursor: pointer; font-variant: small-caps; width: 84px; font-size: 20px; margin: 0; }' + '#plugbot-userlist { border: 6px solid rgba(10, 10, 10, 0.8); border-left: 0 !important; background-color: #000000; padding: 8px 0px 20px 0px; width: 12%; position: absolute; }' + '#plugbot-userlist p { margin: 0; padding-top: 2px; text-indent: 24px; font-size: 10px; }' + '#plugbot-userlist p:first-child { padding-top: 0px !important; }' + '#plugbot-queuespot { color: #42A5DC; text-align: left; font-size: 15px; margin-left: 8px }');
$("#button-vote-positive").click();
initAPIListeners();
populateUserlist();
displayUI();
initUIListeners();​