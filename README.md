PlugBot-Enhancements
====================

Enhancements to connergdavis's plugbot, "A collection of extensions to the growing online DJing website, plug.dj. The source code is written in JavaScript utilising the Plug.dj API anywhere possible. Easily embeddable as a bookmark in your favourite browser. Initially inspired by TechGuard's AutoWoot script from back in April '12. "

###Features List###
New features are being added daily, however the current list of features is as follows:
* Auto-woot : Automatically WOOT! each song as it is played
* Auto-joining : Automatically re-append yourself to the DJ Waitlist once you've been moved back to the crowd
* User list : A dynamic list of every user in the room, color-coded based on their current vote. Green = Woot, Red =   Meh, White = No vote. Special usergroups are denoted by the icon you'd normally see in the chat
* Button UI : Allows you to easily configure your Plug.bot experience; enable or disable each of its features at the click of a button. Red = Off, Green = On
* Hide video : Allows you to hide videos from your view
* A variety of chat commands that enable you to 
    * change your display name with /nick
    * change user status with /avail, /afk, /work, /sleep
    * join/leave the dj booth with /join or /leave
    * woot or meh a song with /woot or /.meh (. added in front of meh due to plug.dj's interpretation of /meh as an emote)

###Installation###

To install, create a new bookmark in your favourite browser and copy/paste this to the 'URL/Location' of the bookmark (or even better just select all the text and drag it there)
```javascript:%20(function%20()%20{%20var%20jsCode%20=%20document.createElement('script');%20jsCode.setAttribute('id',%20'plugbot-js');%20jsCode.setAttribute('src',%20'https://raw.github.com/Colgate/PlugBot-Enhancements/master/plugbot-enhanced.js');%20document.body.appendChild(jsCode);%20}());```
