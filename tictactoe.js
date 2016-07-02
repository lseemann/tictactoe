function Board () {
  var size = 3,
      spots = Array(0).fill(size * size),
                 // Creates an array of 0 values, one for each spot on the board.
                 // Each spot starts as 0 but will change to 1 or 2,
                 // depending on who plays there.
      characters = [null, 'X', 'O'], // Can be set by user.
      humanity = [null, true, false], // Is the respective player a human? Can be set by user.
      turn = 1, // Either 1 or 2.
      goesfirst = 1, // Either 1 or 2.
      winner = 0, // Either 0 (for an unfinished game or draw), 1 or 2.
      winningSet = [], // Will be populated once there’s a winner
      winningSets = [ [0, 1, 2], [3, 4, 5], [6, 7, 8],
                      [0, 3, 6], [1, 4, 7], [2, 5, 8],
                      [0, 4, 8], [2, 4, 6] ];

  this.setTurn = function(player) {
    turn = player;
  }

  this.toggleTurn = function() {
    turn = turn === 1 ? 2 : 1;
  }

  this.setOwner = function(spot, owner) {
    spots[spot] = owner;
  }

  function currentPlayerIsComputer() {
    return !humanity[turn];
  }

  this.gameIsOver = function() {
    return this.getOpenSpots().length === 0 || this.hasWinner();
  }

  // Returns false if game is incomplete or a draw
  this.hasWinner = function() {
    return winner > 0;
  }

  this.getWinner = function() {
    return winner;
  }

  // Return an array of the spots that are still unoccupied.
  this.getOpenSpots = function() {
    // Create an array of all possible indices, based on size of board.
    var openSpots = Array.apply(null, {length: (size * size)}).map(Number.call, Number)
    // Return an array of indices whose spots are open
    return openSpots.filter(function(spot) { return spots[spot] === 0 });
  }

  // Take the settings from the user and, if valid, apply them to the board.
  // Then, hide the settings, reveal the board, and commence play.
  this.loadBoard = function() {
    var p1_identity = document.querySelector('input[name="p1-identity"]:checked').value,
        p2_identity = document.querySelector('input[name="p2-identity"]:checked').value,
        p1_character = document.getElementById('p1-character').value.charAt(0),
        p2_character = document.getElementById('p2-character').value.charAt(0),
        error = validateCharacters(p1_character, p2_character);

    if (error) {
      announcement.display('<span class="error">' + error + '</span>');
    }
    else {
      characters = [
        null,
        p1_character,
        p2_character
      ],
      humanity = [
        null,
        p1_identity === "human",
        p2_identity === "human"
      ];

      document.getElementById('ttt-options').style.display = 'none';
      document.getElementById('ttt-arena').style.display = 'block';

      if (document.querySelector('input[name="goes-first"]:checked').value === 'p2') {
        goesfirst = 2;
      }

      this.startGame();
    }
  }

  // Reset the configuration of the board and commence play.
  this.startGame = function() {
    spots = [
      0, 0, 0,
      0, 0, 0,
      0, 0, 0
    ],
    winner = 0,
    winningSet = [],
    turn = goesfirst;

    drawBoard(spots, characters, this.getOpenSpots(), size);
    this.goToNextTurn();
  }

  this.goToNextTurn = function() {
    // If it's now a computer's turn, find the best move and make it.
    if (currentPlayerIsComputer()) {
      var that = this;
      // Give it a delay so we can observe things happening.
      setTimeout(function () {
        that.makeMove(that.getBestMove());
      }, 200)
    }
    // If it’s a human’s turn, prompt her.
    else {
      announcement.display(getPrompt(turn))
    }
  }

  // Receive a move from the UI.
  this.selectMove = function(spot) {
    // Prevent a sneaky move from being made on computer's turn.
    if (spots[spot] === 0 && winner === 0 && currentPlayerIsComputer() === false) {
      this.makeMove(spot);
    }
  }

  this.makeMove = function(spot) {
    this.setOwner(spot, turn);
    drawBoard(spots, characters, this.getOpenSpots(), size);
    this.checkGameStatus();
    if (this.gameIsOver()) {
      winner === 0 ? announceDraw() : announceWin(winningSet, winner)
    }
    else {
      this.toggleTurn()
      this.goToNextTurn();
    }
  }

  // Check to see if there is a winner yet. If there is (or if there’s a draw)
  // update the values of winner and winningSet.
  this.checkGameStatus = function() {
    winningSets.forEach( function(set){
      if (spots[set[0]] == spots[set[1]] &&
          spots[set[0]] == spots[set[2]] &&
          spots[set[0]] !== 0) {
        winner = spots[set[0]];
        winningSet = set;
      }
    })
  }

  this.getBestMove = function() {
    // For the sake of speed and user experience, let's return random or
    // pre-determined moves for the first and second move of the game, respectively
    if (this.getOpenSpots().length === (size * size)) {
      return getRandomMove();
    }
    if (this.getOpenSpots().length === (size * size - 1)) {
      return getBestSecondMove();
    }

    // If it's 0’s turn, we seek the move with the lowest value.
    // If it's 1’s turn, we seek the move with the highest.
    var bestMove,
        openSpots = this.getOpenSpots(),
        bestValue = turn === 1 ? 99999 : -99999;

    for (var i = openSpots.length - 1; i >= 0; i--) {
      var move = openSpots[i],
          moveValue = this.valueOfPlay(move)

      if (turn == 1 && moveValue < bestValue ||
          turn == 2 && moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
    }
    return bestMove;
  }

  // Returns a lower (negative) value for moves that favor Player 1,
  // a higher value for moves that favor Player 2
  this.valueOfPlay = function(move) {
    var tempBoard = this.cloneBoard(),
        score     = 0,
        weight    = tempBoard.getOpenSpots().length + 1; // Give more weight to
                                                         // winning moves that occur earlier.

    tempBoard.setOwner(move, turn)
    tempBoard.checkGameStatus();

    if (tempBoard.gameIsOver()) {
      if (tempBoard.getWinner() === 1) {
        score -= weight;
      }
      else if (tempBoard.getWinner() === 2){
        score += weight;
      }
      tempBoard = null;
      return score;
    }
    else {
      tempBoard.toggleTurn()
      score += tempBoard.valueOfPlay(tempBoard.getBestMove());
    }
    return score
  }

  // Used as we recursively explore possible outcomes, this copies the state of the board
  // into another temporary board so it can be tested non-destructively.
  this.cloneBoard = function() {
    var newBoard = new Board();
    for (var i = spots.length - 1; i >= 0; i--) {
      newBoard.setOwner(i, spots[i]);
    };
    newBoard.setTurn(turn);
    return newBoard;
  }

  function getRandomMove() {
    return Math.floor(Math.random() * (size * size - 1));
  }

  function getBestSecondMove() {
    var bestSecondMoves = [4, 0, 4, 0, 0, 8, 4, 6, 4],
        firstMove;

    firstMove = spots.indexOf(1) >= 0 ? spots.indexOf(1) : spots.indexOf(2);

    return bestSecondMoves[firstMove];
  }

} // End Board()

/*----------  Functions pertaining to the UI  ----------*/

function announceDraw() {
  document.getElementById('ttt-table').classList.add('game-over');
  announcement.display('Draw! <em>Sometimes the only winning move is not to play.</em>');
}

function announceWin(winningSet, winner) {
  document.getElementById('ttt-table').classList.add('game-over');
  winningSet.forEach( function(spot) {
    document.getElementById('pos-' + spot).classList.add('winner')
    document.getElementById('pos-' + spot).classList.add('winner-' + winner)
  })
  announcement.display('Player ' + winner + ' has won!')
}

function drawBoard(spots, characters, openSpots, size) {
  announcement.clear()
  for (var i = spots.length - 1; i >= 0; i--) {
    document.getElementById('pos-' + i).innerHTML = characters[spots[i]] || '&nbsp;';
    if (spots[i] !== 0) {
      document.getElementById('pos-' + i).className += " taken";
    }
  }
  // If this is an empty board, reset a few things.
  if (openSpots.length === (size * size)) {
    document.getElementById('reset-button').classList.remove('active');
    document.getElementById('ttt-table').classList.remove('game-over');
    removeClass('taken');
    removeClass('winner');
    removeClass('winner-1');
    removeClass('winner-2');
  }
  else {
    document.getElementById('reset-button').classList.add('active');
  }
}

function getPrompt(turn) {
  return 'Player ' + turn + ', it is your turn.';
}

function showOptions() {
  announcement.display('Please choose from the following options for your game:');
  document.getElementById('ttt-options').style.display = 'block';
  document.getElementById('ttt-arena').style.display = 'none';
}

function removeClass(classname) {
  var els = document.getElementsByClassName(classname);
  while (els.length > 0) {
    els[0].classList.remove(classname);
  }
}

function validateCharacters(characterA, characterB) {
  if (characterA.length === 0) {
    return 'Player 1 needs a character.';
  }
  if (characterB.length === 0) {
    return 'Player 2 needs a character.';
  }
  if (characterA === characterB) {
    return 'It looks like both players have the same character. Please change one.'
  }
  return false;
}

var announcement = {
  el: document.getElementById('announcement'),

  display: function(message) {
    this.el.innerHTML = message;
  },

  clear: function() {
    this.el.innerHTML = '';
  }
}

var board = new Board();