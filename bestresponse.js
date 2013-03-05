var Generator = require("./generator")
  , inherit = require("inherit")
  ;

function BestResponsePath(game, start){
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
  
  this.A = this.game['tl-r'] - this.game['bl-r'];
  this.B = this.game['tl-c'] - this.game['tr-c'];
  this.C = this.game['br-r'] - this.game['tr-r'];
  this.D = this.game['br-c'] - this.game['bl-c'];
  
  if (this.A + this.C > 0){
    this.qborder =  1.0;
  }
  else if (this.A + this.C < 0){
    this.qborder = 0.0;
  }
  else if (this.A < 0){
    this.qborder = 0.0;
  }
  else if (this.A > 0){
    this.qborder = 1.0;
  }
  else {
    this.qborder = NaN;
  }
  
  if (this.B + this.D > 0){
    this.pborder =  1.0;
  }
  else if (this.B + this.D < 0){
    this.pborder = 0.0;
  }
  else if (this.D < 0){
    this.pborder = 0.0;
  }
  else if (this.D > 0){
    this.pborder = 1.0;
  }
  else {
    this.pborder = NaN;
  }
  
  this.plim = this.D / (this.B + this.D);
  this.qlim = this.A / (this.A + this.C);
  
  this.start = extend({x:0, y:0}, start); //start should be an object with .x and .y for coordinate properties
  
  this.options = extend({
    debug: false
  , interval: 0
  , max_iterations: 20
  }, options);
}

module.exports = BestResponsePath;

inherit(BestResponsePath, Generator);

BestResponsePath.prototype.generate = function (){

  var iterations = 0
    , max_iterations = this.options.max_iterations
    , done = false
    ;
  
  var self = this;
  function next(x, y, lastx, lasty){
    lastx = lastx || x;
    lasty = lsaty || y;
    
    return function (){
      var newx, newy;
      var skipdraw = false;
    
      if (done || iterations >= max_iterations){
        self.emit("done");
      }
      else {
        iterations += 1;
        
        if (x == self.qlim && y == self.plim){
          newx = x;
          newy = y;
        }
        else if (x == self.qlim){
          if (lastx < self.qlim){
            newx = x + 0.00001;
            newy = y;
            skipdraw = true;
          }
          else if (lastx > self.qlim){
            newx = x - 0.00001;
            newy = y;
            skipdraw = true;
          }
          else {
            newx = x;
            newy = y;
            skipdraw = true;
            done = true;
          }
        }
        else if (y == self.plim){
          if (lasty < self.plim){
            newy = y + 0.00001;
            newx = x;
            skipdraw = true;
          }
          else if (lasty > self.plim){
            newy = y - 0.00001;
            newx = x;
            skipdraw = true;
          }
          else {
            newx = x;
            newy = y;
            skipdraw = true;
            done = true;
          }
        }
        else {
          var targetx = self.getTargetPX(x, y)
            , targety = self.getTargetQY(x, y)
            ;
            
            
          if ((x < self.qlim && targetx > self.qlim) ||
              (x > self.qlim && targetx < self.qlim) ||
              (y < self.plim && targety > self.plim) ||
              (y > self.plim && targety < self.plim)){
            
            if (targetx == x){
              newx = x;
              newy = self.plim;
            }
            else {
              var m = (targety - y) / (targetx - x)
                , b = y - m * x
                , hitpx = (self.plim - b) / m
                , hitpy = self.plim
                , hitqx = self.qlim
                , hitqy = m * self.qlim + b
                , pdist = Math.pow(x - hitpx, 2) + Math.pow(y - hitpy, 2)
                , qdist = Math.pow(x - hitqx, 2) + Math.pow(y - hitqy, 2)
                , targetdist = Math.pow(x - targetx, 2) + Math.pow(y - targety, 2)
                , samep = ((targetx - x) * (hitpx - x) + (targety - y) * (hitpy - y)) > 0
                , sameq = ((targetx - x) * (hitqx - x) + (targety - y) * (hitqy - y)) > 0
                ;
                
                if (samep && sameq){
                  if (pdist < qdist){
                    newx = hitpx;
                    newy = hitpy;
                  }
                  else {
                    newx = hitqx;
                    newy = hitqy;
                  }
                }
                else if (samep){
                  newx = hitpx;
                  newy = hitpy;
                }
                else {
                  newx = hitqx;
                  newx = hitqy;
                }
            }
          }
          else {
            newx = targetx;
            newy = targety;
          }
        }
        
        if ((x == newx && y == newy) || (newx == self.start.x && newy == self.start.y)){
          done = true;
        }
        
        if (!skipdraw){
          self.emit("point", {x: newx, y: newy});
        }
        
        setTimeout(next(newx, newy, x, y), self.options.interval);
      }
    };
  }
  
  setTimeout(next(this.start.x, this.start.y), 10);
};

BestResponsePath.prototype.getTargetQY = function (x, y){
  if (!isFinite(this.qlim)){
    if (this.A < 0){
      return 0.0;
    }
    else if (this.A > 0){
      return 1.0;
    }
    else {
      return y;
    }
  }
  else if (isNaN(this.qborder)) {
    return y;
  }
  else if (x < this.qlim){
    return this.qborder;
  }
  else if (x > this.qlim){
    return 1 - this.qborder;
  }
  else {
    return y;
  }
};

BestResponsePath.prototype.getTargetPX = function (x, y){
  if (!isFinite(this.plim)){
    if (this.D < 0){
      return 0.0;
    }
    else if (this.D > 0){
      return 1.0;
    }
    else {
      return x;
    }
  }
  else if (isNaN(this.pborder)) {
    return x;
  }
  else if (y < this.plim){
    return this.pborder;
  }
  else if (y > this.plim){
    return 1 - this.pborder;
  }
  else {
    return x;
  }
};
