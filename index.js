var Emitter = require("emitter")
  , inherit = require("inherit")
  ;

module.exports = {
  ContinuousReplicatorPath: ContinuousReplicatorPath
, DiscreteReplicatorPath: DiscreteReplicatorPath
, BestResponsePath: BestResponsePath
, ContinuousReplicatorVector: ContinuousReplicatorVector
, util: {
    payoff: payoff
  , avg_payoff: avg_payoff
  , dxydt: dxydt
  }
};

function Generator(game){
  this.game = game || {};
}

inherit(Generator, Emitter);

//Payoff for player "typ" (1=row, 0=col) playing strategy "str" against the population
function payoff(str, typ, pops, game){
  game = game || this.game || {};
  var opp = 1-typ
    , opp0 = pops[opp]
    , opp1 = 1-opp0
    , score = 0
    ;
  
  if (typ == 1){ //row player
    if (str == 0){
      score = (game['tl-r'] || 0) * opp1 + (game['tr-r'] || 0) * opp0;
    }
    else if (str == 1){
      score = (game['bl-r'] || 0) * opp1 + (game['br-r'] || 0) * opp0;
    }
    else {
      throw new Error("Unknown str parameter value: " + str);
    }
  }
  else if (typ == 0){ //col player
    if (str == 0){
      score = (game['tl-c'] || 0) * opp0 + (game['bl-c'] || 0) * opp1;
    }
    else if (str == 1){
      score = (game['tr-c'] || 0) * opp0 + (game['br-c'] || 0) * opp1;
    }
    else {
      throw new Error("Unknown str parameter value: " + str);
    }
  }
  else {
    throw new Error("Unknown typ parameter value: " + typ);
  }
  
  return score;
}

Generator.prototype.payoff = payoff;

//Average payoff for player "typ" (1=row, 0=col) in the population "pops"
function avg_payoff(typ, pops, game){
  game = game || this.game || {};
  return pops[typ] * payoff(game, 1-typ, typ, pops) + (1 - pops[typ]) * payoff(game, typ, typ, pops);
}

Generator.prototype.avg_payoff = avg_payoff;

function dxydt(x, y, game){
  game = game || this.game || {};
  var dxy = [0, 0];
  var pop = [x, y];
  
  dxy[0] = x * (payoff(game, 1, 0, pop) - avg_payoff(game, 0, pop)); //column value, x is the pct of str 1
  dxy[1] = y * (payoff(game, 0, 1, pop) - avg_payoff(game, 1, pop)); //row value, y is the pct of str 0
  
  return dxy;
}

Generator.prototype.dxydt = dxydt;

function ContinuousReplicatorPath(game, start, options){
  this.game = game || {};
  this.options = options || {}; //recognized options are "timestep", "duration", "interval", and "debug" so far
  this.start = start || {}; //start should be an object with .x and .y for coordinate properties
}

inherit (ContinuousReplicatorPath, Generator);

ContinuousReplicatorPath.prototype.generate = function (){
  
  // This uses Runge-Kutta 4 with timestep of 1e-3 and duration 50
  var timestep = this.options.timestep || 0.001;
  var duration = this.options.duration || 50;
  
  var t = 0;
  var self = this;
  function next(x, y){
    return function (){
      if (t >= duration){
        done();
      }
      else {
        t = t + timestep;
        
        var x1, x2, x3, x4, y1, y2, y3, y4, dxy, xnew, ynew;
        
        dxy = self.dxydt(x, y);
        
        x1 = dxy[0];
        y1 = dxy[1];
        
        dxy = self.dxydt(x, y + (timestep * y1 / 2.0));
        y2 = dxy[1];
        
        dxy = self.dxydt(game, x, y + (timestep * y2 / 2.0));
        y3 = dxy[1];
        
        dxy = self.dxydt(game, x, y + timestep * y3);
        y4 = dxy[1];
        
        ynew = y + timestep * (y1 + 2*y2 + 2*y3 + y4) / 6.0;
        
        dxy = self.dxydt(x + (timestep * y1 / 2.0), y);
        x2 = dxy[0];
        
        dxy = self.dxydt(x + (timestep * y2 / 2.0), y);
        x3 = dxy[0];
        
        dxy = self.dxydt(x + timestep * x3, y);
        x4 = dxy[0];
        
        xnew = x + timestep * (x1 + 2*x2 + 2*x3 + x4) / 6.0;
        
        self.emit("point", {x: xnew, y: ynew});
        
        if (self.options.debug){
          console.log("Time %s", t);
          console.log("Dxy:");
          console.log(dxy);
          console.log("x, y: %s, %s", x, y);
          console.log("xnew, ynew: %s, %s", xnew, ynew);
          console.log("x1, x2, x3, x4: %s, %s, %s, %s", x1, x2, x3, x4);
          console.log("y1, y2, y3, y4: %s, %s, %s, %s", y1, y2, y3, y4);
        }
        
        if ([xnew, ynew] == [x, y]) self.emit("done");
        else setTimeout(next(xnew, ynew), self.options.interval || 0); 
      };
    }
  }
  
  setTimeout(next(this.start.x, this.start.y), 10);
}

function DiscreteReplicatorPath(game, start, alpha){
  
}

inherit(DiscreteReplicatorPath, Generator);

function BestResponsePath(game, start){
  
}

inherit(BestResponsePath, Generator);

function ContinuousReplicatorVector(game, start){
  
}

inherit(ContinuousReplicatorVector, Generator);
