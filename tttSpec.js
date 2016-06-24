describe("Tic Tac Toe", function() {


  it("recognizes a winner", function() {
    board = new Board();

    board.setSpots([0,0,0,
      1,null,null,
      null,null,1])
    expect(board.getWinner()).toBe(0);
    expect(board.getOpenSpots().length).toBe(4);

    board.setSpots([0,1,null,
      0,null,1,
      0,null,1])
    expect(board.getWinner()).toBe(0);
    expect(board.getOpenSpots().length).toBe(3);

    board.setSpots([1,1,null,
      0,1,1,
      0,null,1])
    expect(board.getWinner()).toBe(1);
    expect(board.getOpenSpots().length).toBe(2);
  });

  it("gets the right best move", function() {
    board = new Board();

    board.setSpots([0,null,0,
      1,null,null,
      null,null,1])
    board.setTurn(0)
    expect(board.getBestMove()).toBe(1);
    expect(board.getOpenSpots().length).toBe(5);


  });


});