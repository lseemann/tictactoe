function Board (size) {
  var spots = [],
      characters = [null, 'X', 'O'], // Can be set by user.
      humanity = [null, true, false], // Is the respective player a human? Can be set by user.
      turn = 1, // Either 1 or 2.
      goesFirst = 1, // Either 1 or 2.
      winner = 0, // Either 0 (for an unfinished game or draw), 1 or 2.
      winningSet = []; // Will be populated once there’s a winner

  this.getSpots = function() {
    return spots;
  }

  this.getSize = function() {
    return size;
  }

  this.setTurn = function(player) {
    turn = player;
  }

  this.toggleTurn = function() {
    turn = turn === 1 ? 2 : 1;
  }

  this.getCharacters = function() {
    return characters;
  }

  this.setCharacters = function(p1, p2) {
    characters = [ null, p1, p2 ];
  }

  this.setHumanity = function(p1, p2) {
    humanity = [ null, p1, p2 ];
  }

  this.setGoesFirst = function(player) {
    goesFirst = player;
  }

  this.setOwner = function(spot, owner) {
    spots[spot] = owner;
  }

  this.currentPlayerIsComputer = function() {
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

  // Reset the configuration of the board and commence play.
  this.startGame = function() {
    spots = Array(size * size).fill(0), // Creates an array of 0 values, one for each spot on the board.
                 // Each spot starts as 0 but will change to 1 or 2,
                 // depending on who plays there.
    winner = 0,
    winningSet = [],
    turn = goesFirst;

    tttUI.drawBoard();
    tttUI.goToNextTurn(turn);
  }

  this.makeMove = function(spot) {
    this.setOwner(spot, turn);
    tttUI.drawBoard();
    this.checkGameStatus();
    if (this.gameIsOver()) {
      winner === 0 ? tttUI.announceDraw() : tttUI.announceWin(winningSet, winner)
    }
    else {
      this.toggleTurn()
      tttUI.goToNextTurn(turn);
    }
  }

  // Check to see if there is a winner yet. If there is (or if there’s a draw)
  // update the values of winner and winningSet.
  this.checkGameStatus = function() {
    this.getWinningSets().forEach( function(set){
      var i = 0,
          setHasWinner = true;
      while (i + 1 < size && spots[set[i]]) {
        if (spots[set[i]] !== spots[set[i+1]]) {
          setHasWinner = false
          break;
        }
        i += 1;
      }
      if (setHasWinner && spots[set[0]] !== 0) {
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
    if (this.getOpenSpots().length === (size * size - 1) && size == 3) {
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
    var newBoard = new Board(size);
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

  // Helper function to determine winning sets for the board,
  // depending on its size.
  this.getWinningSets = function() {

    return getRows(size).concat(getCols(size)).concat(getDiags(size))

    function getRows(size) {
      var rows = [];
      for (var i = 0; i < size; i++) {
        row = []
        for (var j = 0; j < size; j++) {
          row.push(j + i * size)
        };
        rows.push(row)
      };
      return rows;
    }

    function getCols(size) {
      var cols = [];
      for (var i = 0; i < size; i++) {
        col = []
        for (var j = 0; j < size; j++) {
          col.push(j * size + i)
        };
        cols.push(col)
      };
      return cols;
    }

    function getDiags(size) {
      var diag1 = [],
          diag2 = []
      for (var i = 0; i < size; i++) {
        diag1.push(i + i * size)
        diag2.push(size - 1 + (i * (size - 1)))
      }
      return [diag1, diag2]
    }
  }

}

/*=====  End of Board()  ======*/

/*----------  Functions pertaining to the UI  ----------*/

var tttUI = {
  message_el: document.getElementById('announcement'),

  displayMessage: function(message) {
    this.message_el.innerHTML = message;
  },

  clearMessage: function() {
    this.message_el.innerHTML = '';
  },

  announceDraw: function () {
    document.getElementById('ttt-table').classList.add('game-over');
    this.displayMessage('Draw! <em>Sometimes the only winning move is not to play.</em>');
  },

  announceWin: function(winningSet, winner) {
    document.getElementById('ttt-table').classList.add('game-over');
    winningSet.forEach( function(spot) {
      document.getElementById('pos-' + spot).classList.add('winner')
      document.getElementById('pos-' + spot).classList.add('winner-' + winner)
    })
    tttUI.displayMessage('Player ' + winner + ' has won!')
  },

  // Take the settings from the user and, if valid, apply them to the board.
  // Then, hide the settings, reveal the board, and commence play.
  loadBoard: function() {
    var p1_identity  = document.querySelector('input[name="p1-identity"]:checked').value,
        p2_identity  = document.querySelector('input[name="p2-identity"]:checked').value,
        p1_character = document.getElementById('p1-character').value.charAt(0),
        p2_character = document.getElementById('p2-character').value.charAt(0),
        error        = this.validateCharacters(p1_character, p2_character);

    if (error) {
      this.displayMessage('<span class="error">' + error + '</span>');
    }
    else {
      if (document.querySelector('input[name="goes-first"]:checked').value === 'p2') {
        board.setGoesFirst(2);
      }

      board.setCharacters(p1_character, p2_character)
      board.setHumanity(p1_identity === "human", p2_identity === "human")

      document.getElementById('ttt-options').style.display = 'none';
      document.getElementById('ttt-arena').style.display = 'block';

      board.startGame();
    }
  },

  drawBoard: function(spots, characters, openSpots, size) {
    var characters = board.getCharacters(),
        openSpots  = board.getOpenSpots(),
        size       = board.getSize(),
        spots      = board.getSpots();

    this.clearMessage()
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
      this.removeClass('taken');
      this.removeClass('winner');
      this.removeClass('winner-1');
      this.removeClass('winner-2');
    }
    else {
      document.getElementById('reset-button').classList.add('active');
    }
  },

  selectMove: function(spot) {
    // Prevent a sneaky move from being made on computer's turn.
    if (board.getOpenSpots().indexOf(spot) >= 0 && board.getWinner() === 0 && board.currentPlayerIsComputer() === false) {
      board.makeMove(spot);
    }
  },

  goToNextTurn: function(turn) {
    // If it's now a computer's turn, find the best move and make it.
    if (board.currentPlayerIsComputer()) {
      // var that = this;
      // Give it a delay so we can observe things happening.
      setTimeout(function () {
        board.makeMove(board.getBestMove());
      }, 200)
    }
    // If it’s a human’s turn, prompt her.
    else {
      this.displayMessage(this.getPrompt(turn))
    }
  },

  getPrompt: function(turn) {
    return 'Player ' + turn + ', it is your turn.';
  },

  showOptions: function() {
    this.displayMessage('Please choose from the following options for your game:');
    document.getElementById('ttt-options').style.display = 'block';
    document.getElementById('ttt-arena').style.display = 'none';
  },

  removeClass: function(classname) {
    var els = document.getElementsByClassName(classname);
    while (els.length > 0) {
      els[0].classList.remove(classname);
    }
  },

  validateCharacters: function(characterA, characterB) {
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
}

/*=====  End of tttUI  ======*/




