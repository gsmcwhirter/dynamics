
module.exports = {
  continuousReplicatorPath: continuousReplicatorPath
, discreteReplicatorPath: discreteReplicatorPath
, bestResponsePath: bestResponsePath
, continuousReplicatorVector: continuousReplicatorVector
, util: {
    payoff: payoff
  , avg_payoff: avg_payoff
  , dxydt: dxydt
  }
};

//Payoff for player "typ" (1=row, 0=col) playing strategy "str" against the population
function payoff(game, str, typ, pops){
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

//Average payoff for player "typ" (1=row, 0=col) in the population "pops"
function avg_payoff(game, typ, pops){
  return pops[typ] * payoff(game, 1-typ, typ, pops) + (1 - pops[typ]) * payoff(game, typ, typ, pops);
}

function dxydt(game, x, y){
  var dxy = [0, 0];
  var pop = [x, y];
  
  dxy[0] = x * (payoff(game, 1, 0, pop) - avg_payoff(game, 0, pop)); //column value, x is the pct of str 1
  dxy[1] = y * (payoff(game, 0, 1, pop) - avg_payoff(game, 1, pop)); //row value, y is the pct of str 0
  
  return dxy;
}

function continuousReplicatorPath(game, start, callback, options){
  //start should be an object with .x and .y for coordinate properties
  var path = [start];
  
  // This uses Runge-Kutta 4 with timestep of 1e-3 and duration 50
  var timestep = options.timestep || 0.001;
  var duration = options.duration || 50;
  
  var t = 0;
  function next(x, y){
    return function (){
      if (t >= duration){
        done();
      }
      else {
        t = t + timestep;
        
        var x1, x2, x3, x4, y1, y2, y3, y4, dxy, xnew, ynew;
        
        console.log("Time %s", t);
        dxy = dxydt(game, x, y);
        console.log("Dxy:");
        console.log(dxy);
        
        x1 = dxy[0];
        y1 = dxy[1];
        
        dxy = dxydt(game, x, y + (timestep * y1 / 2.0));
        y2 = dxy[1];
        
        dxy = dxydt(game, x, y + (timestep * y2 / 2.0));
        y3 = dxy[1];
        
        dxy = dxydt(game, x, y + timestep * y3);
        y4 = dxy[1];
        
        ynew = y + timestep * (y1 + 2*y2 + 2*y3 + y4) / 6.0;
        
        dxy = dxydt(game, x + (timestep * y1 / 2.0));
        x2 = dxy[0];
        
        dxy = dxydt(game, x + (timestep * y2 / 2.0));
        x3 = dxy[0];
        
        dxy = dxydt(game, x + timestep * x3);
        x4 = dxy[0];
        
        xnew = x + timestep * (x1 + 2*x2 + 2*x3 + x4) / 6.0;
        
        path.push({x: xnew, y: ynew});
        
        setTimeout(next(xnew, ynew), 10);
      };
    }
  }
  
  function done(){
    callback(path);
  }
  
  setTimeout(next(start.x, start.y), 10);
}

function discreteReplicatorPath(game, start, alpha){
  
}

function bestResponsePath(game, start){
  
}

function continuousReplicatorVector(game, start){
  
}
