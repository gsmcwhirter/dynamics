var Generator = require("./generator")
  , inherit = require("inherit")
  ;
  
function ContinuousReplicatorVector(game, start, options){
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
  }, options);
  
  this.start = extend({x:0, y:0}, start); //start should be an object with .x and .y for coordinate properties
}

module.exports = ContinuousReplicatorVector;

inherit(ContinuousReplicatorVector, Generator);

ContinuousReplicatorVector.prototype.generate = function (){
  var dxy = this.dxydt(this.start.x, this.start.y);
  
  this.emit("point", {x: this.start.x + dxy[0], y: this.start.y + dxy[1]});
  this.emit("done");
};
