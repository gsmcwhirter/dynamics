module.exports = {
  payoff: payoff
, avg_payoff: avg_payoff
, dxydt: dxydt
};

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

//Average payoff for player "typ" (1=row, 0=col) in the population "pops"
function avg_payoff(typ, pops, game){
  this.payoff = this.payoff || payoff;
  return pops[typ] * this.payoff(1-typ, typ, pops, game) + (1 - pops[typ]) * this.payoff(typ, typ, pops, game);
}

function dxydt(x, y, game){
  var dxy = [0, 0];
  var pop = [x, y];
  
  this.payoff = this.payoff || payoff;
  this.avg_payoff = this.avg_payoff || avg_payoff;
  
  dxy[0] = x * (this.payoff(1, 0, pop, game) - this.avg_payoff(0, pop, game)); //column value, x is the pct of str 1
  dxy[1] = y * (this.payoff(0, 1, pop, game) - this.avg_payoff(1, pop, game)); //row value, y is the pct of str 0
  
  return dxy;
}