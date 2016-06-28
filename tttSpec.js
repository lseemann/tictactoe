describe("Tic Tac Toe", function() {

  it("knows when the game is over", function() {
    var board = new Board();
    board.setSpots([2,2,2,
                    1,0,0,
                    0,0,1])
    board.checkGameStatus();
    expect(board.gameIsOver()).toBe(true)

    board = new Board();
    board.setSpots([2,1,2,
                    1,1,2,
                    1,2,1])
    board.checkGameStatus();
    expect(board.gameIsOver()).toBe(true)

    board = new Board();
    board.setSpots([0,0,0,
                    0,0,0,
                    0,0,0])
    board.checkGameStatus();
    expect(board.gameIsOver()).toBe(false)

    board = new Board();
    board.setSpots([2,0,2,
                    1,2,0,
                    0,0,1])
    board.checkGameStatus();
    expect(board.gameIsOver()).toBe(false)
  })

  it("recognizes a winner", function() {
    var board = new Board();

    board.setSpots([2,2,2,
                    1,0,0,
                    0,0,1])
    board.checkGameStatus();
    expect(board.hasWinner()).toBe(true);
    expect(board.getWinner()).toBe(2);

    board = new Board();
    board.setSpots([2,1,0,
                    2,0,1,
                    2,0,1])
    board.checkGameStatus();
    expect(board.hasWinner()).toBe(true);
    expect(board.getWinner()).toBe(2);

    board = new Board();
    board.setSpots([1,2,0,
                    2,1,2,
                    2,0,1])
    board.checkGameStatus();
    expect(board.hasWinner()).toBe(true);
    expect(board.getWinner()).toBe(1);

    board = new Board();
    board.setSpots([1,2,0,
                    2,0,2,
                    2,0,1])
    board.checkGameStatus();
    expect(board.hasWinner()).toBe(false);
    expect(board.getWinner()).toBe(0);

    board = new Board();
    board.setSpots([0,0,0,
                    0,0,0,
                    0,0,0])
    board.checkGameStatus();
    expect(board.hasWinner()).toBe(false);
    expect(board.getWinner()).toBe(0);

    board = new Board();
    board.setSpots([1,2,1,
                    1,1,2,
                    2,1,2])
    board.checkGameStatus();
    expect(board.hasWinner()).toBe(false);
    expect(board.getWinner()).toBe(0);

  });

  it("count empty spots", function() {
    var board = new Board();
    board.setSpots([1,0,0,
                0,0,0,
                0,0,0])
    expect(board.getOpenSpots().length).toBe(8)

    board.setSpots([1,0,0,
                0,0,2,
                0,0,0])
    expect(board.getOpenSpots().length).toBe(7)

    board.setSpots([1,1,0,
                0,0,2,
                0,0,0])
    expect(board.getOpenSpots().length).toBe(6)

    board.setSpots([1,1,2,
                0,0,2,
                0,0,0])
    expect(board.getOpenSpots().length).toBe(5)

    board.setSpots([1,1,2,
                1,0,2,
                0,0,0])
    expect(board.getOpenSpots().length).toBe(4)

    board.setSpots([1,1,2,
                1,2,2,
                0,0,0])
    expect(board.getOpenSpots().length).toBe(3)

    board.setSpots([1,1,2,
                1,2,2,
                2,0,0])
    expect(board.getOpenSpots().length).toBe(2)

    board.setSpots([1,1,2,
                1,2,2,
                2,1,0])
    expect(board.getOpenSpots().length).toBe(1)

    board.setSpots([1,1,2,
                1,2,2,
                2,1,2])
    expect(board.getOpenSpots().length).toBe(0)

  })

  it("gets the right best move", function() {
    var move,
        board = new Board();

    // Best Second move
    board.setTurn(2);
    board.setSpots([1,0,0,
                    0,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move).toBe(4);

    board = new Board();
    board.setTurn(2);
    board.setSpots([0,1,0,
                    0,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move === 0 || move === 1).toBe(true);

    board = new Board();
    board.setTurn(2);
    board.setSpots([0,0,1,
                    0,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move).toBe(4);

    board = new Board();
    board.setTurn(2);
    board.setSpots([0,0,0,
                    1,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move === 0 || move === 6).toBe(true);

    board = new Board();
    board.setTurn(2);
    board.setSpots([0,0,0,
                    0,1,0,
                    0,0,0])
    move = board.getBestMove();
    expect(move === 0 || move === 2 || move === 6 || move === 8).toBe(true);

    board = new Board();
    board.setTurn(2);
    board.setSpots([0,0,0,
                    0,0,1,
                    0,0,0]);
    move = board.getBestMove();
    expect(move === 2 || move === 8).toBeTruthy();

    board = new Board();
    board.setTurn(2);
    board.setSpots([0,0,0,
                    0,0,0,
                    1,0,0]);
    move = board.getBestMove();
    expect(move).toBe(4);

    board = new Board();
    board.setTurn(2);
    board.setSpots([0,0,0,
                    0,0,0,
                    0,1,0]);
    move = board.getBestMove();
    expect(move === 6 || move === 8).toBeTruthy();

    board = new Board();
    board.setTurn(2);
    board.setSpots([0,0,0,
                    0,0,0,
                    0,0,1]);
    move = board.getBestMove();
    expect(move).toBe(4);

    // Best second move, if player 2 goes first
    board = new Board();
    board.setSpots([2,0,0,
                    0,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move).toBe(4);

    board = new Board();
    board.setSpots([0,2,0,
                    0,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move === 0 || move === 1).toBeTruthy();

    board = new Board();
    board.setSpots([0,0,2,
                    0,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move).toBe(4);

    board = new Board();
    board.setSpots([0,0,0,
                    2,0,0,
                    0,0,0]);
    move = board.getBestMove();
    expect(move === 0 || move === 6).toBeTruthy();

    board = new Board();
    board.setSpots([0,0,0,
                    0,2,0,
                    0,0,0])
    move = board.getBestMove();
    expect(move === 0 || move === 2 || move === 6 || move === 8).toBeTruthy();

    board = new Board();
    board.setSpots([0,0,0,
                    0,0,2,
                    0,0,0]);
    move = board.getBestMove();
    expect(move === 2 || move === 8).toBeTruthy();

    board = new Board();
    board.setSpots([0,0,0,
                    0,0,0,
                    2,0,0]);
    move = board.getBestMove();
    expect(move).toBe(4);

    board = new Board();
    board.setSpots([0,0,0,
                    0,0,0,
                    0,2,0]);
    move = board.getBestMove();
    expect(move === 6 || move === 8).toBeTruthy();

    board = new Board();
    board.setSpots([0,0,0,
                    0,0,0,
                    0,0,2]);
    move = board.getBestMove();
    expect(move).toBe(4);


    // Defends against defeat
    board = new Board();
    board.setSpots([0,2,2,
                    1,0,0,
                    0,0,1]);
    board.setTurn(1);
    move = board.getBestMove();
    expect(move).toBe(0);

    board = new Board();
    board.setSpots([2,0,2,
                    1,0,0,
                    1,0,1]);
    board.setTurn(2);
    move = board.getBestMove();
    expect(move).toBe(1);

    board = new Board();
    board.setSpots([0,0,2,
                    1,0,2,
                    2,1,1]);
    board.setTurn(1);
    move = board.getBestMove();
    expect(move).toBe(4);

    // Takes victory when it can
    board = new Board();
    board.setSpots([2,0,2,
                    0,0,0,
                    1,0,1]);
    board.setTurn(1);
    move = board.getBestMove();
    expect(move).toBe(7);

    board = new Board();
    board.setSpots([2,1,2,
                    1,1,0,
                    2,2,1]);
    board.setTurn(1);
    move = board.getBestMove();
    expect(move).toBe(5);

    board = new Board();
    board.setSpots([1,1,2,
                    1,0,0,
                    2,0,2]);
    board.setTurn(2);
    move = board.getBestMove();
    expect(move === 7 || move === 5 || move === 4).toBeTruthy();


    // Sets up a checkmate
    board = new Board();
    board.setSpots([0,2,1,
                    0,0,2,
                    0,0,1]);
    board.setTurn(1);
    move = board.getBestMove();
    expect(move === 6 || move === 4).toBeTruthy();

    board.setTurn(2)
    move = board.getBestMove();
    expect(move).toBe(4);

  });
}); // End Describe("Tic Tac Toe")