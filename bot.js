// Declarations
const Discord 	= require ("discord.js");
const config 	= require('./config.json');    
const https     = require('https');
const fs        = require('fs');                // FileSystem
const client 	= new Discord.Client();         // Server

// Startup
client.on("ready", () => {
    console.log("Bot has initiated.");
});

// Listening to client messages
// To give owner special permissions used config.ownerId when checking
//     message.author.id
client.on("message", (message) => {
	// Check if we're missing our prefix
	if(message.content.indexOf(config.prefix) === 0 || message.author.bot)
	{
	    var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    	var command = args.shift().toLowerCase();

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

    			let image = args[0];
    			console.log("image: " + image);

    			var imagecode = image.match( /:(\d+)>/igu)[0];
                var imagecode = imagecode.substring(1, imagecode.length-1);
    			console.log("image: " + imagecode);

                var emoji = client.emojis.get(imagecode);
                console.log("emoji: " + emoji.url);

                // Get filetype
                var filetype = emoji.url.match(/\.[a-z]*$/igu)[0];
                console.log("filetype: " + filetype);

    			var filename = imagecode + filetype;
    			var imagelink = emoji.url;//config.imagelink + filename;

                console.log("fulllink: " + imagelink);

                _download(imagelink, './image' + filetype, function() {
                    message.channel.send({files: ['./image' + filetype]});
                });
    			 
    		} else {
    			message.reply("Missing image parameter.");	
    		}
    	}	
	} else return;
});

client.login(config.token);

// helper functions
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

