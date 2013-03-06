var Generator = require("./generator")
  , inherit = require("inherit")
  , extend = require("extend")
  ;
  
function ContinuousReplicatorPath(game, start, options){
  this.game = extend({
    "tl-r": 0
  , "tl-c": 0
  , "tr-r": 0
  , "tr-c": 0
  , "bl-r": 0
  , "bl-c": 0
  , "br-r": 0
  , "br-c": 0
  }, game);
  
  this.options = extend({
    debug: false
  , timestep: 1e-3
  , duration: 50
  , interval: 0
  }, options);
  
  this.start = extend({x:0, y:0}, start); //start should be an object with .x and .y for coordinate properties
}

module.exports = ContinuousReplicatorPath;

inherit (ContinuousReplicatorPath, Generator);

ContinuousReplicatorPath.prototype.generate = function (){
  
  // This uses Runge-Kutta 4 with timestep of 1e-3 and duration 50
  var timestep = this.options.timestep;
  var duration = this.options.duration;
  
  var t = 0;
  var self = this;
  function next(x, y){
    return function (){
      if (t >= duration){
        self.emit("done");
      }
      else {
        t = t + timestep;
        
        var x1, x2, x3, x4, y1, y2, y3, y4, dxy, xnew, ynew;
        
        dxy = self.dxydt(x, y);
        
        x1 = timestep * dxy[0];
        y1 = timestep * dxy[1];
        
        y2 = timestep * self.dydt(x, y + (y1 / 2.0));
        y3 = timestep * self.dydt(x, y + (y2 / 2.0));
        y4 = timestep * self.dydt(x, y + y3);
        ynew = y + (y1 + 2*y2 + 2*y3 + y4) / 6.0;
        
        x2 = timestep * self.dxdt(x + (y1 / 2.0), y);
        x3 = timestep * self.dxdt(x + (y2 / 2.0), y);
        x4 = timestep * self.dxdt(x + x3, y);
        xnew = x + (x1 + 2*x2 + 2*x3 + x4) / 6.0;
        
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
        else setTimeout(next(xnew, ynew), self.options.interval); 
      };
    }
  }
  
  setTimeout(next(this.start.x, this.start.y), 10);
}
