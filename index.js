String.prototype.stripHTML = function () { return this.replace(/<\/?[^>]+(>|$)/g, '').replace(/&lt;/g, ' ** ').replace(/&gt;/g, ' ** ')/*.replace(/&/g, '').replace(/>/g, '').replace(/</g, '').replace(/"/g, '').replace(/;/g, '')*/ },
String.prototype.stripbot = function () { return this.replace('bot', '') }, // delete the prefix in game 
String.prototype.stripglo = function () { return this.replace('Global ', '') };
const Discord = require('discord.js')
const bot = new Discord.Client({autoReconnect:true})
const config = require('./config.json')

module.exports = function DiscordChat(mod) {
	
	const command = mod.command || mod.require.command;
	bot.login(config.token)

	bot.on('ready', () => {
		var channel = bot.channels.get(config.channel) 
		console.log(`${bot.user.tag} is online!`)
		channel.send(` *** ${bot.user.tag} : is online ***`)
	})

	if (config.back){
		bot.on("error", (e) => console.error(e));
		bot.on("warn", (e) => console.warn(e));
		bot.on("debug", (e) => console.info(e));
}

	let discordAuthor
	bot.on('message', function chatMessage(msg) {
		if (!msg.author.bot && (msg.channel.id === config.channel)) {
			discordAuthor = msg.author.username
			console.log(`[<font color="#83bad4">${discordAuthor}</font>] : ${msg.content.stripHTML()}`)
		}
	});

	let prefix = "!";
bot.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  if (message.content.startsWith(prefix + "up")) {
    message.channel.send("i'm up");}
});

	bot.on('message', message => {
		if(message.channel.id === config.channel){
			discordAuthor = message.author.username
		  if(
		  message.content.startsWith('Guild') || 
		  message.content.startsWith('@') || 
		  message.content.startsWith('!up') || 
		  message.content.startsWith('@@')){

		  } else { // add prefix or not 
			message.channel.fetchMessages({ limit: 1 }).then(messages => {
			  const lastMessage = messages.first()
			    mod.send('C_CHAT', 1 , {
						channel: config.guild,
						message : '['+discordAuthor+']: '+lastMessage.content.stripbot()
			  })
				/*
			  mod.send('C_CHAT', 1 , {
				channel: config.Glob,
				message : lastMessage.content.stripglo()
			  })
			  */
			  if (config.back){console.log(lastMessage.content.stripbot())}	 
			}).catch(err => {
			  console.error(err)
			})
		 }
		}
	  });

	let myGameName
	mod.hook('S_LOGIN', 14, (event) => {
		myGameName = event.name
	})
	mod.hook('S_CHAT', 3, (event) => { 
		if (event.name === myGameName ) return
		if (config.back){ console.log('<' + event.name + '>:\n -> ' + event.message.stripHTML())} 
		if (event.channel === 2){
		var channel = bot.channels.get(config.channel) 
		channel.send(`Guild [${event.name}] : ${event.message.stripHTML()}`)}
		if (config.global){
		if (event.channel === 4) 
		var channel = bot.channels.get(config.channel) 
		channel.send(`Global [${event.name}] : ${event.message.stripHTML()}`)}
		if (config.trade){
		if (event.channel === 27) 
		var channel = bot.channels.get(config.channel) 
		channel.send(`Trade [${event.name}] : ${event.message.stripHTML()}`)}
	})
	command.add('distest', (arg) => {
		sendMsg(arg, config.channel)
	})
	command.add('back', () => {
		config.back = !config.back
		console.log(`feedback is: ${(config.back)}`)
	})
	function sendMsg(msg, chatChannel) {
		var channel = bot.channels.get(chatChannel)
		channel.send(`@everyone [${myGameName}] : ${msg}`)
	}
	
}

