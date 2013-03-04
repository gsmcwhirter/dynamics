var inherit = require("inherit")
  , Emitter = require("emitter")
  , util = require("./util")
  ;

function Generator(game){
  this.game = game || {};
}

module.exports = Generator;

inherit(Generator, Emitter);

Generator.prototype.payoff = util.payoff;

Generator.prototype.avg_payoff = util.avg_payoff;

Generator.prototype.dxydt = util.dxydt;
