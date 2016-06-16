function Board () {
  var spots = [
                null, null, null,
                null, null, null,
                null, null, null
              ], // Each spot starts as null but will change to 0 or 1,
                 // depending on who plays there.
      characters = ['X', 'O'], // Can be changed by user.
      humanity = [true, false], // Is the respective player a human? Can be changed by user.
      turn = 0, // Either 0 or 1, for Player 1 and 2, respectively.
      goesfirst = 0, // Either 0 or 1.
      winner = null; // Either null (for an unfinished game) or 0, 1, or "Draw."

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
    turn = turn === 0 ? 1 : 0;
  }

  this.setOwner = function(spot, owner) {
    spots[spot] = owner;
  }

  function currentPlayerIsComputer() {
    return !humanity[turn];
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
      announce('<span class="error">' + error + '</span>');
    }
    else {
      characters[0] = p1_character;
      characters[1] = p2_character;
      humanity = [
        p1_identity === "human",
        p2_identity === "human"
      ];

      document.getElementById('ttt-options').style.display = 'none';
      document.getElementById('ttt-arena').style.display = 'block';

      if (document.querySelector('input[name="goes-first"]:checked').value === 'p2') {
        goesfirst = 1;
      }

      this.resetBoard();
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

  // Relay the state of the game to the UI.
  this.drawBoard = function() {
    clearAnnounce()
    for (var i = spots.length - 1; i >= 0; i--) {
      document.getElementById('pos-' + i).innerHTML = characters[spots[i]] || '&nbsp;';
      if (spots[i] !== null) {
        document.getElementById('pos-' + i).className += " taken";
      }
    }
    // If this is an empty board, reset a few things.
    if (this.getOpenSpots().length === 9) {
      document.getElementById('reset-button').classList.remove('active');
      document.getElementById('ttt-table').classList.remove('game-over');
      removeClass('taken');
      removeClass('winner');
      removeClass('winner-0');
      removeClass('winner-1');
    }
    else {
      document.getElementById('reset-button').classList.add('active');
    }
  }

  function removeClass(classname) {
    var els = document.getElementsByClassName(classname);
    while (els.length > 0) {
      els[0].classList.remove(classname);
    }
  }

  // Look for a winner. If there is no winner, the pre-existing value of winner (null).
  // will be returned.
  this.getWinner = function() {
    winningSet = getWinningSet();
    if (winningSet) {
      winner = spots[winningSet[0]]
    }
    else if (this.getOpenSpots().length === 0) {
      winner = 'Draw';
    }
    return winner;
  }

  // Return an array of 3 spots representing the winning play, or false if there's no winner or a draw.
  function getWinningSet() {
    var winningSets = [
              [0, 1, 2], [3, 4, 5], [6, 7, 8],
              [0, 3, 6], [1, 4, 7], [2, 5, 8],
              [0, 4, 8], [2, 4, 6]
              ],
        winningSet = false;

    winningSets.forEach( function(set){
      if (spots[set[0]] == spots[set[1]] &&
          spots[set[0]] == spots[set[2]] &&
          spots[set[0]] !== null) {
        winningSet = [set[0], set[1], set[2]]
      }
    })
    return winningSet;
  }

  // Return an array of the spots that are still empty (null).
  this.getOpenSpots = function() {
    var openSpots = [];
    for (var i = spots.length - 1; i >= 0; i--) {
      if (spots[i] === null) {
        openSpots.push(i);
      }
    }
    return openSpots;
  }

  this.makeMove = function (spot) {
    this.setOwner(spot, turn);
    this.drawBoard();
    this.goToNextTurn()
  }

  this.makeRandomMove = function() {
    var random_move = Math.floor(Math.random() * 8);
    this.makeMove(random_move)
  }

  // Receive a move from the UI.
  this.selectMove = function(spot) {
    // Prevent a sneaky move from being made on computer's turn.
    if (spots[spot] === null && winner === null && currentPlayerIsComputer() === false) {
      this.makeMove(spot);
    }
  }

  this.goToNextTurn = function() {
    // If there’s no winner yet, change turn and act accordingly.
    if (this.getWinner() === null) {
      this.toggleTurn();
      // if it's now the computer's turn, find the best move and make it.
      if (currentPlayerIsComputer()) {
        var that = this;
        // Give it a delay so we can observe things happening
        setTimeout(function () {
          that.makeMove(that.getBestMove(), turn);
        }, 200)
      }
      else {
        announce(getPrompt())
      }
    }

    // But if there is a winner, process the endgame.
    else {
      winningSet = getWinningSet()
      announceWinner(winningSet);
    }
  }

  this.getBestMove = function() {
    // For the sake of speed and user experience, let's return
    // a pre-determined move for the second move of the game.
    if (this.getOpenSpots().length === 8) {
      return getBestSecondMove();
    }

    // If it's 0’s turn, we seek the move with the lowest value.
    // If it's 1’s turn, we seek the move with the highest.
    var bestMove  = null,
        openSpots = this.getOpenSpots(),
        bestValue = this.getTurn() === 0 ? 99999 : -99999;

    for (var i = openSpots.length - 1; i >= 0; i--) {
      var move = openSpots[i],
          moveValue = this.valueOfPlay(move)

      if (this.getTurn() == 0 && moveValue < bestValue ||
          this.getTurn() == 1 && moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
    }
    return bestMove;
  }

  function getBestSecondMove() {
    var bestSecondMoves = [4, 0, 4, 0, 0, 8, 4, 6, 4],
        firstMove;

    firstMove = spots.indexOf(0) >= 0 ? spots.indexOf(0) : spots.indexOf(1);

    return bestSecondMoves[firstMove];
  }

  // Returns a lower (negative) value for moves that favor Player 1,
  // a higher value for moves that favor Player 2
  this.valueOfPlay = function(move) {
    var tempBoard = this.cloneBoard(),
        score     = 0,
        weight    = tempBoard.getOpenSpots().length + 1; // Give more weight to
                                                         // winning moves that occur earlier.

    tempBoard.setOwner(move, tempBoard.getTurn())
    if (tempBoard.getWinner() !== null) {
      if (tempBoard.getWinner() === 0) {
        score -= weight;
      }
      else if (tempBoard.getWinner() === 1){
        score += weight;
      }
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
    for (var i = this.getSpots().length - 1; i >= 0; i--) {
      newBoard.setOwner(i, this.getSpots()[i]);
    };
    newBoard.setTurn(this.getTurn());
    return newBoard;
  }

  this.resetBoard = function() {
    spots = [
      null, null, null,
      null, null, null,
      null, null, null
    ];
    winner = null;
    turn = goesfirst;

    this.drawBoard();
    this.startPlay();
  }

  this.startPlay = function() {
    if (currentPlayerIsComputer()) {
      this.makeRandomMove()
    }
    else {
      announce(getPrompt());
    }
  }

  function announceWinner (winningSet) {
    document.getElementById('ttt-table').classList.add('game-over');
    if (winner == "Draw") {
      announce(winner + '! <em>Sometimes the only winning move is not to play.</em>')
    }
    else {
      winningSet.forEach( function(spot) {
        document.getElementById('pos-' + spot).classList.add('winner')
        document.getElementById('pos-' + spot).classList.add('winner-' + winner)
      })
      announce(characters[winner] + ' has won!')
    }
  }

  function announce(message) {
    document.getElementById('announcement').innerHTML = message;
  }

  function getPrompt() {
    return 'Player ' + characters[turn] + ', it is your turn.';
  }

  function clearAnnounce() {
    document.getElementById('announcement').innerHTML = '';
  }

  this.showOptions = function() {
    announce('Please choose from the following options for your game:');
    document.getElementById('ttt-options').style.display = 'block';
    document.getElementById('ttt-arena').style.display = 'none';
  }

} // End Board()

var board = new Board();
