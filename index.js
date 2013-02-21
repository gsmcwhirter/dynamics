
module.exports = {
  continuousReplicatorPath: continuousReplicatorPath
, discreteReplicatorPath: discreteReplicatorPath
, bestResponsePath: bestResponsePath
, continuousReplicatorVector: continuousReplicatorVector
}

function dxydt(game, x, y){
  var dxy = [0, 0];
  var pop = [x, y];
  
  //Payoff for player "typ" playing strategy "str" against the population
  function payoff(str, typ, pops){
    var opp = 1-typ
      , opp0 = pops[opp]
      , opp1 = 1-opp0
      , score = 0
      ;
    
    if (typ == 1){
      if (str == 0){
        score = game['tl-r'] * opp1 + game['tr-r'] * opp0;
      }
      else if (str == 1){
        score = game['bl-r'] * opp1 + game['br-r'] * opp0;
      }
      else {
        throw new Error("Unknown str parameter value: " + str);
      }
    }
    else if (typ == 0){
      if (str == 0){
        score = game['tl-c'] * opp0 + game['tr-c'] * opp1;
      }
      else if (str == 1){
        score = game['bl-c'] * opp0 + game['br-c'] * opp1;
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
  
  //Average payoff for player "typ" in the population "pops"
  function avg_payoff(typ, pops){
    return pops[typ] * payoff(1-typ, typ, pops) + (1 - pops[typ]) * payoff(typ, typ, pops);
  }
  
  dxy[0] = x * (payoff(1, 0, pop) - avg_payoff(0, pop));
  dxy[1] = y * (payoff(0, 1, pop) - avg_payoff(1, pop));
  
  return dxy;
}

function continuousReplicatorPath(game, start){
  //start should be an object with .x and .y for coordinate properties
  var path = [start];
  
  // This uses Runge-Kutta 4 with timestep of 1e-3 and duration 50
  var timestep = 1e-3;
  var duration = 50;
  
  var x = start.x, y = start.y;
  var x1, x2, x3, x4, y1, y2, y3, y4, dxy, xnew, ynew;
  
  for (var t = 0; t < duration; t += timestep){
    dxy = dxydt(game, x, y); //TODO: implement
    
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
    x = xnew;
    y = ynew;
  }
  
  return path;
}

function discreteReplicatorPath(game, start, alpha){
  
}

function bestResponsePath(game, start){
  
}

function continuousReplicatorVector(game, start){
  
}
