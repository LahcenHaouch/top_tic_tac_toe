function Cell(token = null) {
  if (!new.target) {
    throw new Error("Cell must be called with new.");
  }
  this.token = token;
}
Cell.prototype.setToken = function (token) {
  this.token = token;
};

function BoardController() {
  const [rowSize, columnSize] = [3, 3];

  const board = [];

  const getBoard = () => board;
  const setToken = (rowIndex, columnIndex, token) => {
    board[rowIndex][columnIndex].setToken(token);
  };
  const initBoard = () => {
    for (let i = 0; i < rowSize; i++) {
      board[i] = [];
      for (let j = 0; j < columnSize; j++) {
        board[i][j] = new Cell();
      }
    }
  };

  initBoard();

  return {
    getBoard,
    setToken,
  };
}
function ScreenController() {
  const printBoard = (board) => {
    board.forEach((row) => {
      process.stdout.write("|");
      row.forEach((column) => {
        process.stdout.write(`${column.token}|`);
      });
      console.log("");
    });
  };

  return {
    printBoard,
  };
}

(function GameController() {
  const boardController = BoardController();
  const screenController = ScreenController();
  const players = [
    {
      name: "player_1",
      token: "X",
    },
    {
      name: "player_2",
      token: "O",
    },
  ];
  const [activePlayer] = players;

  const playRound = (rowIndex, columnIndex, token) =>
    boardController.setToken(rowIndex, columnIndex, token);
  const getActivePlayer = () => activePlayer;

  const display = () => screenController.printBoard(boardController.getBoard());
  display();

  playRound(0, 0, "O");
  playRound(1, 1, "X");
  display();
})();
