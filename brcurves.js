var extend = require("extend");

module.exports = function BRCurves(game, options){
  game = extend({
    "tl-r": 0
  , "tl-c": 0
  , "tr-r": 0
  , "tr-c": 0
  , "bl-r": 0
  , "bl-c": 0
  , "br-r": 0
  , "br-c": 0
  }, game);
  
  var A, B, C, D, plim, qlim;
  var rowpath = [], colpath = [];
  
  A = game['tl-r'] - game['bl-r'];
  B = game['tl-c'] - game['tr-c'];
  C = game['br-r'] - game['tr-r'];
  D = game['br-c'] - game['bl-c'];
  
  plim = D / (B + D);
  qlim = A / (A + C);
  
  options = extend({
    debug: false
  }, options);

  //row player response curve
  if (A + C > 0){
    if (qlim <= 1 && qlim >= 0){
      rowpath.push({x: 0, y: 1});
      rowpath.push({x: qlim, y: 1});
      rowpath.push({x: qlim, y: 0});
      rowpath.push({x: 1, y: 0});
    } else if (qlim > 1) {
      //play this
      rowpath.push({x: 0, y: 1});
      rowpath.push({x: 1, y: 1});
    } else {
      rowpath.push({x: 0, y: 0});
      rowpath.push({x: 1, y: 0});
    }
  } 
  else if (A + C < 0){
    if (qlim <= 1 && qlim >= 0){
      rowpath.push({x: 0, y: 0});
      rowpath.push({x: qlim, y: 0});
      rowpath.push({x: qlim, y: 1});
      rowpath.push({x: 1, y: 1});
    } else if (qlim > 1) {
      rowpath.push({x: 0, y: 0});
      rowpath.push({x: 1, y: 0});
    } else {
      rowpath.push({x: 0, y: 1});
      rowpath.push({x: 1, y: 1});
    }
  } 
  else if (A > 0) {
    rowpath.push({x: 0, y: 1});
    rowpath.push({x: 1, y: 1});
  } 
  else if (A < 0) {
    rowpath.push({x: 0, y: 0});
    rowpath.push({x: 1, y: 0});
  }

  //column player response curve
  if (B + D > 0){
    if (plim >= 0 && plim <= 1){
      colpath.push({x: 0, y: 1});
      colpath.push({x: 0, y: plim});
      colpath.push({x: 1, y: plim});
      colpath.push({x: 1, y: 0});
    } else if (plim > 1){
      colpath.push({x: 1, y: 1});
      colpath.push({x: 1, y: 0});
    } else {
      colpath.push({x: 0, y: 1});
      colpath.push({x: 0, y: 0});
    }
  } 
  else if (B + D < 0){
    if (plim >= 0 && plim <= 1){
      colpath.push({x: 0, y: 0});
      colpath.push({x: 0, y: plim});
      colpath.push({x: 1, y: plim});
      colpath.push({x: 1, y: 1});
    } else if (plim > 1) {
      colpath.push({x: 0, y: 1});
      colpath.push({x: 0, y: 0});
    } else {
      colpath.push({x: 1, y: 1});
      colpath.push({x: 1, y: 0});
    }
  } 
  else if (D > 0) {
    colpath.push({x: 1, y: 0});
    colpath.push({x: 1, y: 1});
  } 
  else if (D < 0) {
    colpath.push({x: 0, y: 0});
    colpath.push({x: 0, y: 1});
  }
  
  return [rowpath, colpath];
};
