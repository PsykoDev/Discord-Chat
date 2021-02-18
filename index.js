String.prototype.stripHTML = function () {
  return this.replace(/^<[^>]+>|<\/[^>]+><[^\/][^>]*>|<\/[^>]+>$/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&.{3}/g, "");
};
String.prototype.stripbot = function () {
  return this.replace("bot", "");
}; // delete the prefix in game
String.prototype.stripglo = function () {
  return this.replace("!", "");
};
const Discord = require("discord.js");
const bot = new Discord.Client({ autoReconnect: true });
const config = require("./config.json");

module.exports = function DiscordChat(mod) {
  const Send = require("./send.js");
  const Say = new Send(mod);
  const command = mod.command || mod.require.command;
  bot.login(config.token);

  bot.on("ready", async () => {
    var channel = bot.channels.get(config.channel);
    console.log(`${bot.user.tag} is online!`);
    //channel.send(` *** ${bot.user.tag} : is online ***`);
    console.log(
      `${bot.user.username} est connecté sur ${bot.guilds.size} serveurs !`
    );
    bot.user.setActivity("!help", { type: "GAME" });
    let activNum = 0;
    setInterval(function () {
      if (activNum === 0) {
        bot.user.setActivity("Bot Chat");
        activNum = 1;
      } else if (activNum === 1) {
        bot.user.setActivity("!help pour obtenir les cmds ou pas");
        activNum = 0;
      }
    }, 3 * 1000);
  });

  if (config.back) {
    bot.on("error", (e) => console.error(e));
    bot.on("warn", (e) => console.warn(e));
    //bot.on("debug", (e) => console.info(e));
  }

  let discordAuthor;
  bot.on("message", function chatMessage(msg) {
    if (!msg.author.bot && msg.channel.id === config.channel) {
      discordAuthor = msg.author.username;
      console.log(
        `[<font color="#83bad4">${discordAuthor}</font>] : ${msg.content.stripHTML()}`
      );
    }
  });

  let character, account, statu, restant, gname, gxp, gxplvlup, po, gm, glvl;
  mod.hook("S_GUILD_MEMBER_LIST", 2, (e) => {
    gm = e.guildMaster;
    gname = e.guildName;
    po = e.guildFunds;
    gxplvlup = e.guildXpForLevel;
    gxp = e.guildXp;
    glvl = e.guildLevel;
    character = e.characters;
    account = e.accounts;
    statu = e.members;
  });

  mod.hook("S_GUILD_POINT_INFO_CHANGED", 1, (e) => {
    restant = e.remainingGuildPoints;
  });

  let prefix = config.prefix;
  bot.on("message", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.content.startsWith(prefix + "up")) {
      message.channel.send("i'm up");
    }

    // if(message.content.stripHTML(prefix + "stat")){
    //	var embed = {
    //		"description":```diff\nGM: ${gm}\n GuildXP : ${gxp} / ${gxplvlup}\n Guild Level : ${glvl}\n PO : ${po}\n Compte = ${account}\n Perso = ${character}```,
    //		"color": 16777215,
    //		"author": {
    //		  "name": "Path Reborn"
    //		}
    //	  };
    //	 await channel.send({ embed });
    // }
  });

  bot.on("message", (message) => {
    if (message.channel.id === config.channel) {
      discordAuthor = message.author.username;
      if (
        message.content.match("(Guild|@|!up|!stat|@@|i'm up|https://|http://)")
      ) {
        return false;
      } else {
        message.channel
          .fetchMessages({ limit: 1 })
          .then((messages) => {
            // add prefix or not
            const lastMessage = messages.first();
            if (message.content.startsWith(prefix)) {
              Say.Global(
                "[" + discordAuthor + "]: " + lastMessage.content.stripglo()
              );
            } else {
              Say.Guild(
                "[" + discordAuthor + "]: " + lastMessage.content.stripglo()
              );
            }
            if (config.back) {
              console.log(lastMessage.content.stripbot());
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  });

  let myGameName;
  mod.hook("S_LOGIN", 14, (event) => {
    myGameName = event.name;
  });
  mod.hook("S_CHAT", 3, (event) => {
    let newmessage = event.message
      .replace(/<[^>]*>/g, "")
      .replace(/&.{3}/g, " ** ");
    if (event.name === myGameName) return;
    if (config.back && event.channel === config.guild) {
      console.log("<" + event.name + ">:\n -> " + newmessage);
    }
    if (event.channel === 2) {
      var channel = bot.channels.get(config.channel);
      channel.send(`Guild [${event.name}] : ${newmessage}`);
    }
    if (config.global) {
      if (event.channel === 4) var channel = bot.channels.get(config.channel);
      channel.send(`Global [${event.name}] : ${newmessage}`);
    }
    if (config.trade) {
      if (event.channel === 27) var channel = bot.channels.get(config.channel);
      channel.send(`Trade [${event.name}] : ${newmessage}`);
    }
  });

  mod.command.add("disc", (arg, arg1) => {
    switch (arg) {
      case "reload":
        sendMsg(arg1, config.channel);
        break;
      case "back":
        config.back = !config.back;
        console.log(`feedback is: ${config.back}`);
        break;
      case "stat":
        console.log(character);
        console.log(account);
        console.log(statu);
        console.log(`${restant} / 900`);
        break;
      default:
        mod.command.message("disc: back, test [arg]");
    }
  });

  function sendMsg(msg, chatChannel) {
    var channel = bot.channels.get(chatChannel);
    channel.send(`[${myGameName}] : ${msg}`);
    // <@!231813966282752001> New ping
  }
};
