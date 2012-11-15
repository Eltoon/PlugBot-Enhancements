PlugBot-Enhancements
====================
Enhancements to connergdavis's plugbot, "A collection of extensions to the growing online DJing website, plug.dj. The source code is written in JavaScript utilising the Plug.dj API anywhere possible. Easily embeddable as a bookmark in your favourite browser. Initially inspired by TechGuard's AutoWoot script from back in April '12. "


###NOTICE###
This is a modified version of an existing script, found here https://github.com/connergdavis/Plugbot


###Features List###
New features are being added daily, however the current list of features is as follows:
* Auto-woot : Automatically WOOT! each song as it is played
* Auto-joining : Automatically re-append yourself to the DJ Waitlist once you've been moved back to the crowd
   * (Moderators can turn this off by @messaging you and using the !disable command. Useful in rooms that disallow afk - autojoining)
* User list : A dynamic list of every user in the room, color-coded based on their current vote. Green = Woot, Red =   Meh, White = No vote. Special usergroups are denoted by the icon you'd normally see in the chat
* Button UI : Allows you to easily configure your Plug.bot experience; enable or disable each of its features at the click of a button. Red = Off, Green = On
* Hide video : Allows you to hide videos from your view
* A variety of chat commands that enable you to 
    * change your display name with /nick
    * change user status with /avail, /afk, /work, /sleep
    * join/leave the dj booth with /join or /leave
    * woot or meh a song with /woot or /.meh (. added in front of meh due to plug.dj's interpretation of /meh as an emote)
* Chat notifications for when users enter/leave the room, plus when songs are curated.


###Installation###

To install, create a new bookmark in your favorite browser and copy/paste this to the 'URL/Location' of the bookmark.
<pre>javascript:%20(function%20()%20{%20var%20jsCode%20=%20document.createElement('script');%20jsCode.setAttribute('id',%20'plugbot-js');%20jsCode.setAttribute('src',%20'https://raw.github.com/Colgate/PlugBot-Enhancements/master/plugbot-enhanced.js');%20document.body.appendChild(jsCode);%20}());</pre>

###Created By###
* Jeremy Richardson - AKA Colgate

<p><strong>Authors of Plug.Bot Core</strong></p>

* Conner Davis
* Harrison Schneidman

###Licensing###
Like the original, this script is licensed under a GNU/GPL license.
<p>
This program is free software: you can redistribute it and/or modify
<br />
it under the terms of the GNU General Public License as published by
<br />
the Free Software Foundation, either version 3 of the License, or
<br />
(at your option) any later version.
</p>

<p>
This program is distributed in the hope that it will be useful,
<br />
but WITHOUT ANY WARRANTY; without even the implied warranty of
<br />
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
<br />
GNU General Public License for more details.
</p>
<p>
You should have received a copy of the GNU General Public License
<br />
along with this program.  If not, see http://www.gnu.org/licenses/.</p>

###Version History###
1.0.2
Initial Upload
- Plug.Bot Core
- Changed UI anchor and moved location to underneath chat to prevent popout chat from disabling access by deleting UI.
- ChatCommands (nick, statuses, join/leave, votes)
- Disable command for moderators to turn your autojoin off (@username !disable)
- Chat notifications for join/leave/curate
- more to come!
