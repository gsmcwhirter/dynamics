var test_games = [
  {
    'tl-r': 1
  , 'tl-c': -1
  , 'tr-r': -1
  , 'tr-c': 1
  , 'bl-r': -1
  , 'bl-c': 1
  , 'br-r': 1
  , 'br-c': -1
  }
, {
    'tl-r': 3
  , 'tl-c': 3
  , 'tr-r': 0
  , 'tr-c': 4
  , 'bl-r': 4
  , 'bl-c': 0
  , 'br-r': 1
  , 'br-c': 1
  } 
, {
    'tl-r': 4
  , 'tl-c': 4
  , 'tr-r': 0
  , 'tr-c': 2
  , 'bl-r': 2
  , 'bl-c': 0
  , 'br-r': 2
  , 'br-c': 2
  } 
];

var should = require("should")
  , dynamics = require("../index")
  ; 

describe("dynamics", function (){
  describe("#payoff()", function (){
    it("should calculate payoffs correctly", function (){
      var results_10 = [[[1,-1], [-1,1]], [[0,1], [0,1]], [[0,2], [0,2]]];
      var results_01 = [[[-1,1], [1,-1]], [[3,4], [3,4]], [[4,2], [4,2]]];
      var results_55 = [[[0,0], [0,0]], [[1.5,2.5], [1.5,2.5]], [[2,2], [2,2]]];
      
      for (var i = 0, l = test_games.length; i < l; i++){
        for (var typ = 0; typ < 2; typ++){
          for (var str = 0; str < 2; str++){
            dynamics.util.payoff(test_games[i], str, typ, [1,0]).should.equal(results_10[i][typ][str]);
            dynamics.util.payoff(test_games[i], str, typ, [0,1]).should.equal(results_01[i][typ][str]);
            dynamics.util.payoff(test_games[i], str, typ, [0.5,0.5]).should.equal(results_55[i][typ][str]);
          }
        }
      }
      
    });
  });
  
  describe("#avg_payoff()", function (){
    it("should calculate avg_payoffs correctly", function (){
      var results_10 = [[-1,1], [1,1], [2,2]];
      var results_01 = [[-1,1], [3,3], [4,4]];
      var results_55 = [[0,0], [2,2], [2,2]];
      
      for (var i = 0, l = test_games.length; i < l; i++){
        for (var typ = 0; typ < 2; typ++){
          dynamics.util.avg_payoff(test_games[i], typ, [1,0]).should.equal(results_10[i][typ]);
          dynamics.util.avg_payoff(test_games[i], typ, [0,1]).should.equal(results_01[i][typ]);
          dynamics.util.avg_payoff(test_games[i], typ, [0.5,0.5]).should.equal(results_55[i][typ]);
        }
      }
    });
  });

  describe("#dxydt()", function (){
    it("should calculate derivatives correctly", function (){
      var results_10 = [[0,0], [0,0], [0,0]];
      var results_01 = [[0,0], [0,0], [0,0]];
      var results_55 = [[0,0], [0.25,-0.25], [0,0]];
      var results_91 = [[-0.14399999999999993,-(0.16 * 0.9)], [0,0], [0,0]]; // values not right
      var results_19 = [[(0.16 * 0.9),0.14399999999999993], [1,-1], [0,0]]; // values not right
      
      for (var i = 0, l = test_games.length; i < l; i++){
        dynamics.util.dxydt(test_games[i], 1, 0).should.eql(results_10[i]);
        dynamics.util.dxydt(test_games[i], 0, 1).should.eql(results_01[i]);
        //dynamics.util.dxydt(test_games[i], 0.9, 0.1).should.eql(results_91[i]);
        //dynamics.util.dxydt(test_games[i], 0.1, 0.9).should.eql(results_19[i]);
        dynamics.util.dxydt(test_games[i], 0.5, 0.5).should.eql(results_55[i]);
      }
    });
  });
});
