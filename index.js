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
    const cell = board[rowIndex][columnIndex];
    console.log({ cell });
    if (cell.token !== null) {
      throw new Error(`[${rowIndex}][${columnIndex}]Cell is already set.`);
    }
    cell.setToken(token);
    console.log({ board });
  };
  const initBoard = () => {
    for (let i = 0; i < rowSize; i++) {
      board[i] = [];
      for (let j = 0; j < columnSize; j++) {
        board[i][j] = new Cell();
      }
    }
  };
  const isBoardFull = () => {
    for (let i = 0; i < rowSize; i++) {
      for (let j = 0; j < columnSize; j++) {
        if (board[i][j] === null) {
          return false;
        }
      }
    }
    return true;
  };

  initBoard();

  return {
    getBoard,
    isBoardFull,
    setToken,
  };
}
function ScreenController() {
  const boardEl = document.querySelector(".gameboard");

  const printBoard = (board) => {
    board.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        boardEl.innerHTML += `<li><button data-row="${rowIndex}" data-column="${columnIndex}" data-token="${column.token}"></button></li>`;
      });
    });
  };
  const getBoardEl = () => boardEl;

  return {
    getBoardEl,
    printBoard,
  };
}

(function GameController() {
  const boardController = BoardController();
  const screenController = ScreenController();
  const winningCombinations = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [2, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  let gameState = "ongoing";
  const players = [
    {
      name: "player_1",
      token: "O",
    },
    {
      name: "player_2",
      token: "X",
    },
  ];
  const [activePlayer] = players;

  const parseIndex = (index) => Number.parseInt(index, 10);
  const playRound = (rowIndex, columnIndex, token) => {
    try {
      boardController.setToken(rowIndex, columnIndex, token);
      screenController.updateBoard(rowIndex, columnIndex, token);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const isActivePlayerWinner = () => {
    for (let i = 0; i < winningCombinations.length; i++) {
      const combination = winningCombinations[i];

      let winner = false;
      for (let j = 0; j < combination.length; j++) {
        if (combination[j] !== activePlayer.token) {
          winner = false;
          break;
        }
        winner = true;
      }
      if (winner) {
        return true;
      }
    }
    return false;
  };

  screenController.printBoard(boardController.getBoard());

  screenController.getBoardEl().addEventListener("click", (event) => {
    const { target } = event;

    if (!(target instanceof HTMLButtonElement) || gameState !== "ongoing") {
      return;
    }

    const { row, column, token } = target.dataset;
    if (token !== "null") {
      return;
    }

    playRound(parseIndex(row), parseIndex(column), activePlayer.token);
    if (boardController.isBoardFull() || isActivePlayerWinner()) {
      gameState = "finished";
    }
  });
})();
