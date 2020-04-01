'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function makeComputerStep(availableSteps) {

    var saved = getSavedPosition();
    var stateArray = void 0;

    if (!saved) {
        var steps = availableSteps;

        stateArray = getStateArray();
        saved = {
            stateArray: stateArray,
            steps: steps
        };
        savedPositions.push(saved);
    } else {
        stateArray = saved.stateArray;
    }

    //case when the winning step became a losing
    if (saved.steps.length == 0) {
        saved.steps = availableSteps;
    }

    var randomStepIndex = Math.floor(Math.random() * saved.steps.length);
    changePosition(saved.steps[randomStepIndex]);

    currentState.history.push({
        position: stateArray,
        chosenStep: saved.steps[randomStepIndex]
    });

    currentState.progress += 1;
    redraw();
}

function changePosition(newPosition) {
    currentState.position.computer = currentState.position.computer.map(function (pos) {
        if (newPosition && pos[0] == newPosition.row && pos[1] == newPosition.column) {
            return [newPosition.dest_row, newPosition.dest_column];
        }
        return pos;
    });

    //rewrite player's pawns
    currentState.position.player = currentState.position.player.filter(function (playerPos) {
        if (!(playerPos[0] == newPosition.dest_row && playerPos[1] == newPosition.dest_column)) {
            return playerPos;
        }
    });
}

function getSavedPosition() {
    var currentStateArray = getStateArray();
    var saved = savedPositions.filter(function (saved) {
        return compareArrays(saved.stateArray, currentStateArray);
    });

    if (saved.length == 0) {
        return null;
    } else {
        return saved[0];
    }

    function compareArrays(arr1, arr2) {
        var result = true;
        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr1[i].length; j++) {
                if (arr1[i][j] != arr2[i][j]) {
                    result = false;
                    break;
                }
            }
            if (!result) {
                break;
            }
        }
        return result;
    }
}

function getStateArray() {
    var result = [[], [], []];
    currentState.position.computer.forEach(function (pos) {
        result[pos[0]][pos[1]] = 'c';
    });

    currentState.position.player.forEach(function (pos) {
        result[pos[0]][pos[1]] = 'p';
    });
    return result;
}
function makePlayerStep() {
    var pressed = false;
    var prevRow = void 0,
        prevColumn = void 0;
    var column = void 0,
        row = void 0;

    return function (e) {
        column = e.target.cellIndex;
        row = e.target.parentNode.rowIndex;

        if (currentState.winner == null) {
            if (clickPlayerPawn(row, column)) {
                //player begin step
                pressed = true;
                prevColumn = e.target.cellIndex;
                prevRow = e.target.parentNode.rowIndex;
            } else if (pressed) {
                //if click in available steps
                if (canPlayerStep(row, column, prevRow, prevColumn)) {
                    redraw();
                    currentState.progress += 1;
                }
                pressed = false;
                prevColumn = null;
                prevRow = null;
            } else {
                pressed = false;
                prevColumn = null;
                prevRow = null;
            }
        }
    };
}

function canPlayerStep(row, column, prevRow, prevColumn) {
    var result = false;

    if (prevColumn == column && prevRow - row == 1) {
        //click on cell in front
        if (!currentState.position.computer.find(function (pos) {
            return pos[0] == row && pos[1] == column;
        })) {
            //if cell is empty
            currentState.position.player = currentState.position.player.map(function (pos) {
                if (pos[0] == prevRow && pos[1] == prevColumn) {
                    //player move forward
                    result = true;
                    return [row, column];
                }
                return [pos[0], pos[1]];
            });
        }
    } else if (Math.abs(prevColumn - column) == 1 && prevRow - row == 1) {
        //find click on computer
        currentState.position.computer = currentState.position.computer.filter(function (pos) {
            if (pos[0] == row && pos[1] == column) {
                result = true;
                //rewrite player if click was on computer
                currentState.position.player = currentState.position.player.map(function (playerPos) {
                    if (playerPos[0] == prevRow && playerPos[1] == prevColumn) {
                        return [row, column];
                    }
                    return playerPos;
                });
            } else {
                return pos;
            }
        });
    }
    return result;
}

function clickPlayerPawn(row, column) {
    var result = false;
    currentState.position.player.forEach(function (pos) {
        if (pos[0] == row && pos[1] == column) {
            result = true;
        }
    });
    return result;
}
function onProgressChange(currentProgress) {
    //check win
    var _checkWin = checkWin(currentProgress),
        _checkWin2 = _slicedToArray(_checkWin, 2),
        winner = _checkWin2[0],
        availableSteps = _checkWin2[1];

    if (winner) {
        currentState.winner = winner;
    } else {
        if (currentProgress % 2 == 1) {
            makeComputerStep(availableSteps);
        }
    }
}

function checkWin(progress) {
    //function return false or [winner, array of available steps or null]
    var winner = getWinnerConst();
    //1. if on enemy side
    var enemySideResult = onEnemySide(progress, winner);
    if (enemySideResult) {
        return [enemySideResult, null];
    }

    //2. if there are no enemy pawns
    var pawns = checkPawns(winner);
    if (pawns) {
        return pawns;
    }

    //3. if there are no enemy available steps
    return checkAvailableSteps(progress, winner);
}

function onEnemySide(progress, winner) {
    var result = false;

    if (progress % 2 == 1) {
        if (checkPosition(currentState.position.player, 0)) {
            result = winner.player;
        }
    } else {
        if (checkPosition(currentState.position.computer, 2)) {
            result = winner.computer;
        }
    }

    return result;

    function checkPosition(array, enemyRow) {
        var result = false;
        array.forEach(function (pos) {
            if (pos[0] == enemyRow) {
                result = true;
            }
        });
        return result;
    }
}

function checkPawns(winner) {
    var result = false;
    if (currentState.position.computer.length == 0) {
        result = [winner.player, null];
    }
    if (currentState.position.player.length == 0) {
        result = [winner.computer, null];
    }
    return result;
}

function checkAvailableSteps(progress, winner) {
    var result = void 0;
    var winner_param = winner;
    if (progress % 2 == 1) {
        check(currentState.position.computer, 'c');
    } else {
        check(currentState.position.player, 'p');
    }
    return result;

    function check(array, flag) {
        var availableSteps = getAvailableSteps(array, flag);
        if (availableSteps.length > 0) {
            result = [false, availableSteps];
        } else {
            var _winner = flag == 'c' ? winner_param.player : winner_param.computer;
            result = [_winner, null];
        }
    }
}

function getAvailableSteps(currentArray, flag) {
    var result = [];
    var stateArray = getStateArray();

    currentArray.forEach(function (pos) {
        var players = ['c', 'p'];

        var row_forward = flag == 'c' ? pos[0] + 1 : pos[0] - 1;
        var diagonal_flag = flag == 'c' ? 'p' : 'c';

        var column_forward = pos[1] + 1;
        var column_back = pos[1] - 1;

        var array_row_forward = stateArray[row_forward];
        if (array_row_forward) {
            //check cell in front
            if (!players.includes(array_row_forward[pos[1]])) {
                result.push({
                    row: pos[0],
                    column: pos[1],
                    dest_row: row_forward,
                    dest_column: pos[1]
                });
            }
            //check cells diagonally
            checkDiagonal(array_row_forward, column_forward, pos, diagonal_flag);
            checkDiagonal(array_row_forward, column_back, pos, diagonal_flag);
        }
    });

    return result;

    function checkDiagonal(array, col, pos, flag) {
        if (array[col] && array[col] == flag) {
            result.push({
                row: pos[0],
                column: pos[1],
                dest_row: pos[0] + 1,
                dest_column: col
            });
        }
    }
}

var player = void 0,
    computer = void 0,
    currentState = void 0;
var savedPositions = [];

function contentLoaded() {
    initGame();
    addEventsToPawn();
    redraw();

    document.querySelector('#newGameBtn').addEventListener('click', newGameClick);
}

function initGame() {
    player = [[2, 0], [2, 1], [2, 2]];

    computer = [[0, 0], [0, 1], [0, 2]];

    currentState = {
        _progress: 0,
        position: {
            player: player,
            computer: computer
        },
        _winner: null,
        history: [],

        progressListener: function progressListener() {
            onProgressChange(this.progress);
        },
        set progress(value) {
            this._progress = value;
            this.progressListener();
        },
        get progress() {
            return this._progress;
        },
        set winner(value) {
            this._winner = value;
            processGame();
        },
        get winner() {
            return this._winner;
        }
    };

    setWinnerMessage('');
}

function newGameClick() {
    initGame();
    redraw();
}

function redraw() {
    var pos = currentState.position;
    var field = document.querySelector('#field');
    Array.from(field.rows).forEach(function (row) {
        Array.from(row.cells).forEach(function (cell) {
            cell.classList.remove('player', 'computer');
        });
    });

    pos.computer.forEach(function (coords) {
        if (coords[0] != null && coords[1] != null) {
            field.rows[coords[0]].cells[coords[1]].classList.add('computer');
        }
    });

    pos.player.forEach(function (coords) {
        if (coords[0] != null && coords[1] != null) {
            field.rows[coords[0]].cells[coords[1]].classList.add('player');
        }
    });
}

function processGame() {
    setWinnerMessage(currentState.winner);

    currentState.history.forEach(function (record) {
        for (var i = 0; i < savedPositions.length; i++) {
            if (savedPositions[i].stateArray == record.position) {
                if (currentState.winner == getWinnerConst().computer) {
                    savedPositions[i].steps = savedPositions[i].steps.filter(function (step) {
                        return step == record.chosenStep;
                    });
                    break;
                } else {
                    savedPositions[i].steps = savedPositions[i].steps.filter(function (step) {
                        return step != record.chosenStep;
                    });
                    break;
                }
            }
        }
    });
}

function getWinnerConst() {
    return {
        player: 'player',
        computer: 'computer'
    };
}

function setWinnerMessage(winner) {
    document.querySelector('#winner_message').textContent = winner;
}

function addEventsToPawn() {
    var pawns = document.querySelectorAll('.pawn');
    var makeStep = makePlayerStep();
    Array.from(pawns).forEach(function (pawn) {
        return pawn.addEventListener('click', function (e) {
            return makeStep(e);
        });
    });
}

document.addEventListener("DOMContentLoaded", contentLoaded);