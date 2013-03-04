var Generator = require("./generator")
  , inherit = require("inherit")
  , extend = require("extend")
  ;
  
function DiscreteReplicatorPath(game, start, options){
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
  
  this.start = extend({x:0, y:0}, start); //start should be an object with .x and .y for coordinate properties
  
  this.options = extend({
    debug: false
  , tolerance: 1e-5
  , interval: 0
  , alpha: 0.1
  }, options);
  
  //adjust payoffs to be non-negative
  var self = this;
  var min = Math.min(this.game['tl-r'], this.game['tl-c'], this.game['tr-r'], this.game['tr-c'], this.game['bl-r'], this.game['bl-c'], this.game['br-r'], this.game['br-c']);
  
  if (min < 0){
    ['tl-r', 'tl-c', 'tr-r', 'tr-c', 'bl-r', 'bl-c', 'br-r', 'br-c'].forEach(function (key){
      self.game[key] -= min;
    });
  }
}

module.exports = DiscreteReplicatorPath;

inherit(DiscreteReplicatorPath, Generator);

DiscreteReplicatorPath.prototype.generate = function (){
  var tolerance = this.options.tolerance;
  var alpha = this.options.alpha;
  
  var self = this;
  function next(x, y){
    return function (){
      var newx, newy;
      
      var avgx = self.avg_payoff(0, [x, y])
        , avgy = self.avg_payoff(1, [x, y])
        ;
        
      if (avgx == 0){
        newx = x;
      }
      else {
        newx = (alpha + self.payoff(1, 0, [x, y])) * x / (alpha + avgx);
      }
      
      if (avgy == 0){
        newy = y;
      }
      else {
        newy = (alpha + self.payoff(0, 1, [x, y])) * y / (alpha + avgy);
      }
      
      self.emit("point", {x: newx, y: newy});
      
      if (Math.abs(x - newx) > tolerance || Math.abs(y - newy) > tolerance){
        setTimeout(next(newx, newy), self.interval)
      }
      else {
        self.emit("done");
      }
    }  
  }
  
  setTimeout(next(this.start.x, this.start.y), 10);
  
};
