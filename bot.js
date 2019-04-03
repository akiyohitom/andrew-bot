// Declarations
const Discord 	= require ("discord.js");
const config 	= require('./config.json');
const client 	= new Discord.Client(); // this is the server


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
    	else if(command === 'penis')
    	{
    		message.channel.send('vagina');
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
    			let imagelink = args[0];
    			console.log("image: " + imagelink);

    			var imagesplit = imagelink.split(':');
    			var imagecode = imagesplit[2].substring(0, imagesplit[2].length-1);

    			console.log("image: " + imagecode);

    			var newimagelink = imagecode + ".png";
    			var link = config.imagelink + newimagelink;
    			var embed = new Discord.RichEmbed().attachFile(link);
    			message.channel.send({embed});
    		} else {
    			message.reply("Missing image parameter.");	
    		}
    	}	
	} else return;
});

client.login(config.token);