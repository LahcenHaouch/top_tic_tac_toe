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
  const setToken = (row, column, token) => {
    board[row][column].setToken(token);
  };
  const initBoard = () => {
    for (let i = 0; i < rowSize; i++) {
      board[i] = [];
      for (let j = 0; j < columnSize; j++) {
        board[i][j] = new Cell();
      }
    }
  };
  const printBoard = () => {
    for (let i = 0; i < rowSize; i++) {
      process.stdout.write("|");
      for (let j = 0; j < columnSize; j++) {
        process.stdout.write(`${board[i][j].token}|`);
      }
      console.log("");
    }
  };

  initBoard();

  return {
    getBoard,
    setToken,
    printBoard,
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

  const playRound = () => null;
  const getActivePlayer = () => activePlayer;
  const getBoard = () => gameBoard.getBoard();

  return {
    getBoard,
    printBoard: gameBoard.printBoard,
  };
}

function ScreenController() {
  const game = GameController();
  game.printBoard();
}

const screen = ScreenController();
