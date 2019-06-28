// Andrew
/* 
TODO
- Print multiple images (parse and print all in same image)
- Separate into files eventually
*/

// Declarations
const Discord 	= require ("discord.js");
const config 	= require('./config.json');    
const https     = require('https');
const fs        = require('fs');                // FileSystem
const client 	= new Discord.Client();         // Server

var testChannel = null;

// Startup
client.on("ready", () => {
    console.log("Bot has initiated.");

    console.log("List of channels:");
    client.channels.forEach((item, index) => { 
        console.log(item.id + " " + item.name);
        if(item.name == "test-channel")
        {
            testChannel = item;
        }
    });
});

// Listening to client messages
// To give owner special permissions used config.ownerId when checking
//     message.author.id
client.on("message", (message) => {
	// Check if we're missing our prefix
    var sender = message.author.username;
    if(!message.author.bot) console.log(sender + " has sent message: ( " + message + " )");

	if(message.content.indexOf(config.prefix) === 0 || message.content.indexOf(config.testprefix) === 0 && !message.author.bot)
	{  
        var testflag = (message.content.charAt(0) == config.testprefix);
	    var args     = message.content.slice(config.prefix.length).trim().split(/ +/g);
    	var command  = args.shift().toLowerCase();
        var test     = config.testprefix;

    	if(command === 'ping')
    	{
    		message.channel.send('pong');
    	}    	
    	else if(command === 'e')
    	{
    		// Works for custom emojis, but not prebuilt emojis
    		// Prebuild emojis are in unicode and need an '\' tp view, and thus require a way to check
    		// Looks like pbot save image locally, and reuploads it as an attachment.
    		// https://cdn.discordapp.com/emojis/561815285108178944.png output of mine
			// https://cdn.discordapp.com/attachments/403882808218484736/562875313122574366/emote.png output of pbot
    		 
    		if(args[0])
    		{
                try {
        			let image = args[0];
                    console.log("EMOJI: " + image);
                    var type = image.charAt(1);


                    if(!_containsUnicode(image))
                    {  
                        var imagecode = image.match( /:(\d+)>/igu)[0];
                        var imagecode = imagecode.substring(1, imagecode.length-1);
                        
                        console.log("IMAGE-CODE: " + imagecode);

                        var filetype = ".png";

                        var emoji = client.emojis.get(imagecode);

                        if(emoji != null)
                        {
                            console.log("EMOJI-URL: " + emoji.url);
                            filetype      = emoji.url.match(/\.[a-z]*$/igu)[0];
                            
                            var filename  = imagecode + filetype;
                            var imagelink = emoji.url;
                        } else {
                            if(type == 'a') 
                                filetype = ".gif";

                            var filename  = imagecode + filetype;
                            var imagelink = config.imagelink + filename;
                        }

                        _download(imagelink, './image' + filetype, function() {       
                            if(testflag && testChannel != null) 
                            {
                                _sendToTest({files: ['./image' + filetype]});
                            } else {
                                message.channel.send({files: ['./image' + filetype]});
                            }
                        });
                    } else {
                        message.channel.send(image); // image is unicode
                    }
                } catch (err) {
                    console.log("An error has occured: REASON (" + err + ").");    
                }   
    		} else {
                if(testflag && testChannel != null)
                {
                    _sendToTest("Error( Missing image parameter )");
                } else {
                    message.reply("Missing image parameter.");  
                }
    		}
    	}	
	} else return;
});

client.login(config.token);

// helper functions
function _containsUnicode(s) {
    return /[^\u0000-\u00ff]/.test(s);
}

function _download(url, dest, callback) {
    var file = fs.createWriteStream(dest)
    https.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(callback());   
        });
    }).on('error', function(err) {
        fs.unlink(dest);
        if(callback) callback(err.message)
    });
};

function _unicodeToChar(text) {
   return text.replace(/\\u[\dA-F]{4}/gi, 
          function (match) {
               return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
          });
};

function _sendToTest(text) {
    console.log("Sent to test channel.");
    testChannel.send(text);
};
