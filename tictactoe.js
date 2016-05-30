function Board () {
  // Assumptions: human is "O" and goes first, computer is "X"

  var spots = [
                null, null, null,
                null, null, null,
                null, null, null
              ],
      winningSets = [
              [0, 1, 2], [3, 4, 5], [6, 7, 8],
              [0, 3, 6], [1, 4, 7], [2, 5, 8],
              [0, 4, 8], [2, 4, 6]
              ],
      winner = null,
      turn = 'X',
      announcement_el = document.getElementById('announcement'),
      table_el = document.getElementById('ttt-table'),
      prompt = 'Player X, you may begin the game.';

  announcement_el.innerHTML = prompt;

  this.getSpots = function() {
    return spots;
  }

  this.getTurn = function() {
    return turn;
  }

  this.setTurn = function(player) {
    turn = player;
  }

  this.toggleTurn = function() {
    turn = turn === 'O' ? 'X' : 'O';
  }

  this.setOwner = function(spot, owner) {
    spots[spot] = owner;
  }

  // Return an array of the spots that are still null
  this.getOpenSpots = function() {
    var openSpots = [];
    for (var i = spots.length - 1; i >= 0; i--) {
      if (!spots[i]) {
        openSpots.push(i);
      }
    }
    return openSpots;
  }

  // Relay the state of the game to the DOM
  this.drawBoard = function() {
    for (var i = spots.length - 1; i >= 0; i--) {
      document.getElementById('pos-' + i).innerHTML = spots[i] || '&nbsp;';
      if (spots[i]) {
        document.getElementById('pos-' + i).className += " taken";
      }
    }
    if (this.getOpenSpots().length === 9) {
      document.getElementById('reset-button').classList.remove('active');
    }
    else {
      document.getElementById('reset-button').classList.add('active');
    }
  }

  this.makeMove = function (spot) {
    // First check to confirm spot is free (owner is not null) and no winner has been declared
    if (!spots[spot] && !winner) {
      announcement_el.innerHTML = ''
      this.setOwner(spot, turn);
      this.drawBoard();
      if (!this.getWinner()) {
        this.toggleTurn();
        // if it's now the computer's turn, find the best move and make it
        if (turn === 'O') {
          this.makeMove(this.getBestMove(), 'O');
        }
      }
      // There's a winner, so let's process the endgame
      else {
        announceWinner();
      }
    }
  }

  this.getBestMove = function() {
    // If this is the first move of the game, let's skip the recursion
    // and play a pre-set move (for the sake of speed/user experience).
    if (this.getOpenSpots().length === 8) {
      if (spots[0] == "X") {
        return 4;
      }
      if (spots[1] == "X") {
        return 0;
      }
      if (spots[2] == "X") {
        return 4;
      }
      if (spots[3] == "X") {
        return 0;
      }
      if (spots[4] == "X") {
        return 0;
      }
      if (spots[5] == "X") {
        return 8;
      }
      if (spots[6] == "X") {
        return 4;
      }
      if (spots[7] == "X") {
        return 6;
      }
      if (spots[8] == "X") {
        return 4;
      }
    }
    // If it's "X"’s turn, we want the lowest value.
    // If it's "O"’s turn, we want the highest.
    var bestMove = null,
        openSpots = this.getOpenSpots(),
        bestValue = this.getTurn() === "X" ? 99999 : -99999;

    for (var i = openSpots.length - 1; i >= 0; i--) {
      var move = openSpots[i],
          moveValue = valueOfPlay(move, this)

      if (this.getTurn() == "X" && moveValue < bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
      else if (this.getTurn() == "O" && moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
    }
    return bestMove;
  }

  function valueOfPlay(move, board) {
    var tempBoard = board.cloneBoard(),
        score = 0,
        weight = tempBoard.getOpenSpots().length + 1;

    tempBoard.setOwner(move, tempBoard.getTurn())
    if (tempBoard.getWinner()) {
      if (tempBoard.getWinner() === "X") {
        // Give more weight to winning moves that occur earlier
        score -= weight;
      }
      else if (tempBoard.getWinner() === "O"){
        score += weight;
      }
      return score;
    }
    else {
      tempBoard.toggleTurn()
      score += valueOfPlay(tempBoard.getBestMove(), tempBoard);
    }
    return score
  }

  // Look for a winner. If there is no winner, the original value of winner (null)
  // will be returned.
  this.getWinner = function() {
    winningSets.forEach( function(winningSet){
      var a = winningSet[0],
          b = winningSet[1],
          c = winningSet[2];

      if ( spots[a] == spots[b] &&
           spots[a] == spots[c] &&
           spots[a] ) {
        winner = spots[a];
      }
    })

    if (!winner && (this.getOpenSpots().length === 0)) {
      winner = 'Draw';
    }
    return winner;
  }

  var announceWinner = function(winningSet) {
    table_el.classList.add('game-over');

    winningSets.forEach( function(winningSet){
      var a = winningSet[0],
          b = winningSet[1],
          c = winningSet[2];

      if ( spots[a] == spots[b] &&
           spots[a] == spots[c] &&
           spots[a] ) {
        winningSet.forEach( function(spot) {
          document.getElementById('pos-' + spot).classList.add('winner')
          document.getElementById('pos-' + spot).classList.add('winner-' + winner)
        })
      }
    })
    if (winner == "Draw") {
      announcement_el.innerHTML = winner + '! <em>Sometimes the only winning move is not to play.</em>'
    }
    else {
      announcement_el.innerHTML = winner + ' has won!'
    }
  }

  this.resetBoard = function() {
    spots = [
      null, null, null,
      null, null, null,
      null, null, null
    ];
    winner = null;
    turn = "X";
    table_el.classList.remove('game-over');
    announcement_el.innerHTML = prompt;
    removeClass('taken');
    removeClass('winner');
    removeClass('winner-X');
    removeClass('winner-O');
    this.drawBoard();
  }

  this.cloneBoard = function() {
    var newBoard = new Board();
    for (var i = this.getSpots().length - 1; i >= 0; i--) {
      newBoard.setOwner(i, this.getSpots()[i]);
      newBoard.setTurn(this.getTurn());
    };
    return newBoard;
  }

  function removeClass(classname) {
    var els = document.getElementsByClassName(classname);
    while (els.length > 0) {
      els[0].classList.remove(classname);
    }
  }

} // End Board()

var board = new Board();