const config = require("./config.json");

class Sends {
  constructor(mod) {
    this.Guild = function (msg) {
      mod.send("C_CHAT", 1, {
        channel: config.guild,
        name: "TIP",
        message: msg,
      });
    };

    this.Global = function (msg) {
      mod.send("C_CHAT", 1, {
        channel: config.Glob,
        name: "TIP",
        message: msg,
      });
    };
  }
}
module.exports = Sends;
