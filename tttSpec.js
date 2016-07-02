function simulateBoard(board, spots) {
    for (var i = spots.length - 1; i >= 0; i--) {
        board.setOwner(i, spots[i])
    };
}

describe("Tic Tac Toe", function() {

  it("recognizes the game is over when there's a winner", function() {
    var board = new Board();
    simulateBoard(board, [2,2,2,
                    1,0,0,
                    0,0,1])
    board.checkGameStatus();
    expect(board.gameIsOver()).toBe(true);
  });

  it("recognizes the game is over because of a draw", function() {
    var board = new Board();
    simulateBoard(board, [2,1,2,
                    1,1,2,
                    1,2,1])
    board.checkGameStatus();
    expect(board.gameIsOver()).toBe(true);
  });

  it("knows a new game is not over yet", function() {
    var board = new Board();
    simulateBoard(board, [0,0,0,
                    0,0,0,
                    0,0,0])
    board.checkGameStatus();
    expect(board.gameIsOver()).toBe(false);
  });

  it("knows an unfinished game is not over yet", function() {
    var board = new Board();
    simulateBoard(board, [2,0,2,
                    1,2,0,
                    0,0,1])
    board.checkGameStatus();
    expect(board.gameIsOver()).toBe(false)
  });

  it("spots a winner in Row 1", function() {
    var board = new Board();
    simulateBoard(board, [2,2,2,
                    1,0,0,
                    0,0,1])
    board.checkGameStatus();
    expect(board.hasWinner()).toBe(true);
    expect(board.getWinner()).toBe(2);
  });

  it("spots a winner in Column 1", function() {
    var board = new Board();
    simulateBoard(board, [2,1,0,
                    2,0,1,
                    2,0,1])
    board.checkGameStatus();
    expect(board.hasWinner()).toBe(true);
    expect(board.getWinner()).toBe(2);
  });

  it("spots a winner in Diagonal 1", function() {
    var board = new Board();
    simulateBoard(board, [1,2,0,
                    2,1,2,
                    2,0,1])
    board.checkGameStatus();
    expect(board.hasWinner()).toBe(true);
    expect(board.getWinner()).toBe(1);
  });

  it("recognizes the lack of a winner in an unfinished game", function() {
    var board = new Board();
    simulateBoard(board, [1,2,0,
                    2,0,2,
                    2,0,1])
    board.checkGameStatus();
    expect(board.hasWinner()).toBe(false);
    expect(board.getWinner()).toBe(0);
  });

  it("recognizes the lack of a winner in a new board", function() {
    var board = new Board();
    simulateBoard(board, [0,0,0,
                    0,0,0,
                    0,0,0])
    board.checkGameStatus();
    expect(board.hasWinner()).toBe(false);
    expect(board.getWinner()).toBe(0);
  });

  it("recognizes the lack of a winner in a draw", function() {
    var board = new Board();
    simulateBoard(board, [1,2,1,
                    1,1,2,
                    2,1,2])
    board.checkGameStatus();
    expect(board.hasWinner()).toBe(false);
    expect(board.getWinner()).toBe(0);
  });

  it("correctly counts 8 empty spots", function() {
    var board = new Board();
    simulateBoard(board, [1,0,0,
                0,0,0,
                0,0,0])
    expect(board.getOpenSpots().length).toBe(8)
  });

  it("correctly counts 7 empty spots", function() {
    var board = new Board();
    simulateBoard(board, [1,0,0,
                0,0,2,
                0,0,0])
    expect(board.getOpenSpots().length).toBe(7)
  });

  it("correctly counts 6 empty spots", function() {
    var board = new Board();
    simulateBoard(board, [1,1,0,
                0,0,2,
                0,0,0])
    expect(board.getOpenSpots().length).toBe(6)
  });

  it("correctly counts 5 empty spots", function() {
    var board = new Board();
    simulateBoard(board, [1,1,2,
                0,0,2,
                0,0,0])
    expect(board.getOpenSpots().length).toBe(5)
  });

  it("correctly counts 4 empty spots", function() {
    var board = new Board();
    simulateBoard(board, [1,1,2,
                1,0,2,
                0,0,0])
    expect(board.getOpenSpots().length).toBe(4)
  });

  it("correctly counts 3 empty spots", function() {
    var board = new Board();
    simulateBoard(board, [1,1,2,
                1,2,2,
                0,0,0])
    expect(board.getOpenSpots().length).toBe(3)
  });

  it("correctly counts 2 empty spots", function() {
    var board = new Board();
    simulateBoard(board, [1,1,2,
                1,2,2,
                2,0,0])
    expect(board.getOpenSpots().length).toBe(2)
  });

  it("correctly counts 1 empty spot", function() {
    var board = new Board();
    simulateBoard(board, [1,1,2,
                1,2,2,
                2,1,0])
    expect(board.getOpenSpots().length).toBe(1)
  });

  it("correctly counts 0 empty spots", function() {
    var board = new Board();
    simulateBoard(board, [1,1,2,
                1,2,2,
                2,1,2])
    expect(board.getOpenSpots().length).toBe(0)

  })

  it("responds correctly when Player 1 opens with Spot 0", function() {
    var move,
        board = new Board();
    board.setTurn(2);
    simulateBoard(board, [1,0,0,
                    0,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move).toBe(4);
  });

  it("responds correctly when Player 1 opens with Spot 1", function() {
    var move,
        board = new Board();
    board.setTurn(2);
    simulateBoard(board, [0,1,0,
                    0,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move === 0 || move === 2).toBe(true);

  });

  it("responds correctly when Player 1 opens with Spot 2", function() {
    var move,
        board = new Board();
    board.setTurn(2);
    simulateBoard(board, [0,0,1,
                    0,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move).toBe(4);

  });

  it("responds correctly when Player 1 opens with Spot 3", function() {
    var move,
        board = new Board();
    board.setTurn(2);
    simulateBoard(board, [0,0,0,
                    1,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move === 0 || move === 6).toBe(true);

  });

  it("responds correctly when Player 1 opens with Spot 4", function() {
    var move,
        board = new Board();
    board.setTurn(2);
    simulateBoard(board, [0,0,0,
                    0,1,0,
                    0,0,0])
    move = board.getBestMove();
    expect(move === 0 || move === 2 || move === 6 || move === 8).toBe(true);

  });

  it("responds correctly when Player 1 opens with Spot 5", function() {
    var move,
        board = new Board();
    board.setTurn(2);
    simulateBoard(board, [0,0,0,
                    0,0,1,
                    0,0,0]);
    move = board.getBestMove();
    expect(move === 2 || move === 8).toBe(true);

  });

  it("responds correctly when Player 1 opens with Spot 6", function() {
    var move,
        board = new Board();
    board.setTurn(2);
    simulateBoard(board, [0,0,0,
                    0,0,0,
                    1,0,0]);
    move = board.getBestMove();
    expect(move).toBe(4);

  });

  it("responds correctly when Player 1 opens with Spot 7", function() {
    var move,
        board = new Board();
    board.setTurn(2);
    simulateBoard(board, [0,0,0,
                    0,0,0,
                    0,1,0]);
    move = board.getBestMove();
    expect(move === 6 || move === 8).toBe(true);

  });

  it("responds correctly when Player 1 opens with Spot 8", function() {
    var move,
        board = new Board();
    board.setTurn(2);
    simulateBoard(board, [0,0,0,
                    0,0,0,
                    0,0,1]);
    move = board.getBestMove();
    expect(move).toBe(4);
  });

  it("responds correctly when Player 2 opens with Spot 0", function() {
    var move,
        board = new Board();
    simulateBoard(board, [2,0,0,
                    0,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move).toBe(4);

  });

  it("responds correctly when Player 2 opens with Spot 1", function() {
    var move,
        board = new Board();
    simulateBoard(board, [0,2,0,
                    0,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move === 0 || move === 1).toBe(true);

  });

  it("responds correctly when Player 2 opens with Spot 2", function() {
    var move,
        board = new Board();
    simulateBoard(board, [0,0,2,
                    0,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move).toBe(4);

  });

  it("responds correctly when Player 2 opens with Spot 3", function() {
    var move,
        board = new Board();
    simulateBoard(board, [0,0,0,
                    2,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move === 0 || move === 6).toBe(true);

  });

  it("responds correctly when Player 2 opens with Spot 4", function() {
    var move,
        board = new Board();
    simulateBoard(board, [0,0,0,
                    0,2,0,
                    0,0,0])
    move = board.getBestMove();
    expect(move === 0 || move === 2 || move === 6 || move === 8).toBe(true);

  });

  it("responds correctly when Player 2 opens with Spot 5", function() {
    var move,
        board = new Board();
    simulateBoard(board, [0,0,0,
                    0,0,2,
                    0,0,0]);
    move = board.getBestMove();
    expect(move === 2 || move === 8).toBe(true);

  });

  it("responds correctly when Player 2 opens with Spot 6", function() {
    var move,
        board = new Board();
    simulateBoard(board, [0,0,0,
                    0,0,0,
                    2,0,0]);
    move = board.getBestMove();
    expect(move).toBe(4);

  });

  it("responds correctly when Player 2 opens with Spot 7", function() {
    var move,
        board = new Board();
    simulateBoard(board, [0,0,0,
                    0,0,0,
                    0,2,0]);
    move = board.getBestMove();
    expect(move === 6 || move === 8).toBe(true);

  });

  it("responds correctly when Player 2 opens with Spot 8", function() {
    var move,
        board = new Board();
    simulateBoard(board, [0,0,0,
                    0,0,0,
                    0,0,2]);
    move = board.getBestMove();
    expect(move).toBe(4);


    // Defends against defeat
  });

  it("goes for win in corner", function() {
    var move,
        board = new Board();
    simulateBoard(board, [0,2,2,
                    1,0,0,
                    0,0,1]);
    board.setTurn(1);
    move = board.getBestMove();
    expect(move).toBe(0);

  });

  it("goes for win in edge", function() {
    var move,
        board = new Board();
    simulateBoard(board, [2,0,2,
                    1,0,0,
                    1,0,1]);
    board.setTurn(2);
    move = board.getBestMove();
    expect(move).toBe(1);

  });

  it("goes for win in center", function() {
    var move,
        board = new Board();
    simulateBoard(board, [0,0,2,
                    1,0,2,
                    2,1,1]);
    board.setTurn(1);
    move = board.getBestMove();
    expect(move).toBe(4);

    // Takes victory when it can
  });


  it("responds correctly when Player 1 opens with Spot 1", function() {
    var move,
        board = new Board();
    simulateBoard(board, [2,1,2,
                    1,1,0,
                    2,2,1]);
    board.setTurn(1);
    move = board.getBestMove();
    expect(move).toBe(5);

  });

  it("goes for win when there are two possibilities", function() {
    var move,
        board = new Board();
    simulateBoard(board, [0,1,2,
                    1,1,0,
                    2,0,2]);
    board.setTurn(2);
    move = board.getBestMove();
    expect(move === 7 || move === 5).toBe(true);
  });

  it("spots a checkmate and goes for it", function() {
    var move,
        board = new Board();
    simulateBoard(board, [0,2,1,
                    0,0,2,
                    0,0,1]);
    board.setTurn(1);
    move = board.getBestMove();
    expect(move === 6 || move === 4).toBe(true);

    board.setTurn(2)
    move = board.getBestMove();
    expect(move).toBe(4);

  });
}); // End Describe("Tic Tac Toe")