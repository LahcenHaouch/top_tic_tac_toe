function Cell(token = null) {
  if (!new.target) {
    throw new Error("Cell must be called with new.");
  }
  this.token = null;
}
Cell.prototype.setToken = function (token) {
  this.token = token;
};

function Gameboard() {
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

function GameController() {
  const gameBoard = Gameboard();
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

  const playRound = (rowIndex, columnIndex, token) => gameBoard.setToken(rowIndex, columnIndex, token);
  const getActivePlayer = () => activePlayer;
  const getBoard = () => gameBoard.getBoard();

  return {
    getBoard,
    getActivePlayer,
    playRound
  };
}

function ScreenController() {
  const game = GameController();

  const board = game.getBoard();

  const printBoard = () => {
    board.forEach(row => {
      process.stdout.write("|");
      row.forEach(column => {
        process.stdout.write(`${column.token}|`);
      })
      console.log("");
    })
  };

  printBoard();
}

const screen = ScreenController();
