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
  const board = [];
  const [rowSize, columnSize] = [3, 3];

  const getBoard = () => board;
  const setToken = (rowIndex, columnIndex, token) => {
    const cell = board[rowIndex][columnIndex];
    if (cell.token !== null) {
      throw new Error(`[${rowIndex}][${columnIndex}]Cell is already set.`);
    }
    cell.setToken(token);
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
        if (board[i][j].token === null) {
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
function DisplayController() {
  const boardEl = document.querySelector(".gameboard");
  const gameStatusEl = document.querySelector(".game-status");

  const printBoard = (board) => {
    board.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        boardEl.innerHTML += `<li><button data-row="${rowIndex}" data-column="${columnIndex}" data-token="${column.token}"></button></li>`;
      });
    });
  };
  const getBoardEl = () => boardEl;
  const updateBoard = (rowIndex, columnIndex, token) => {
    const el = document.querySelector(
      `[data-row="${rowIndex}"][data-column="${columnIndex}"]`,
    );
    if (!el) {
      return;
    }
    el.dataset.token = token;
  };
  const displayGameStatus = (status) => {
    gameStatusEl.textContent = status;
  };

  return {
    getBoardEl,
    printBoard,
    updateBoard,
    displayGameStatus,
  };
}

(function GameController() {
  const boardController = BoardController();
  const displayController = DisplayController();

  const board = boardController.getBoard();

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

  const gameState = {
    status: "ongoing",
    winner: null,
  };
  const players = [
    {
      name: "player_1",
      label: "Player One",
      token: "X",
    },
    {
      name: "player_2",
      label: "Player Two",
      token: "O",
    },
  ];
  let [activePlayer] = players;

  const parseIndex = (index) => Number.parseInt(index, 10);
  const playRound = (rowIndex, columnIndex, token) => {
    try {
      boardController.setToken(rowIndex, columnIndex, token);
      displayController.updateBoard(rowIndex, columnIndex, token);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const isActivePlayerWinner = () => {
    for (let i = 0; i < winningCombinations.length; i++) {
      const combination = winningCombinations[i];

      let winner = true;
      for (let j = 0; j < combination.length; j++) {
        const [row, column] = combination[j];

        if (board[row][column]?.token !== activePlayer.token) {
          winner = false;
          break;
        }
      }
      if (winner) {
        return true;
      }
    }
    return false;
  };

  displayController.printBoard(boardController.getBoard());
  displayController.displayGameStatus(`${activePlayer.label}'s turn`);
  displayController.getBoardEl().addEventListener("click", (event) => {
    console.log("status", gameState.status);
    const { target } = event;

    if (
      !(target instanceof HTMLButtonElement) ||
      gameState.status !== "ongoing"
    ) {
      return;
    }

    const { row, column, token } = target.dataset;
    if (token !== "null") {
      return;
    }

    playRound(parseIndex(row), parseIndex(column), activePlayer.token);
    if (isActivePlayerWinner()) {
      gameState.status = "finished";
      gameState.winner = activePlayer;
      displayController.displayGameStatus(`${activePlayer.label} has won!`);
      return;
    }

    if (boardController.isBoardFull()) {
      gameState.status = "draw";
      displayController.displayGameStatus("It's a draw!");
      return;
    }

    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    displayController.displayGameStatus(`${activePlayer.label}'s turn`);
  });
})();
