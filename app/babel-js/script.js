'use strict';

var player = void 0,
    computer = void 0,
    currentState = void 0;
var savedPositions = void 0;

function contentLoaded() {
    initGame();
    addEventsToPawn();
    redraw();
    console.log(currentState);

    // player2 = [[2, 0], [2, 1], [2, 2]]


    // if (player == player2) {
    //     console.log(124);

    // }

}

function initGame() {
    player = [[2, 0], [2, 1], [2, 2]];

    computer = [[0, 0], [0, 1], [0, 2]];

    currentState = {
        step: 0,
        position: {
            player: player,
            computer: computer
        },
        history: history

        // let state = [['b', 'b', 'b'],
        //             ['empty', 'empty', 'empty'],
        //             ['g', 'g', 'g']]

        // return state;
    };
}

function redraw() {
    pos = currentState.position;
    var field = document.querySelector('#field');
    Array.from(field.rows).forEach(function (row) {
        Array.from(row.cells).forEach(function (cell) {
            // console.log(1, cell.classList);

            cell.classList.remove('player', 'computer');
            // console.log(2, cell.classList);
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
    // console.log(field.rows[0].cells[1].classList.remove(''));

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

function makePlayerStep() {
    var pressed = false;
    // let prevRow, prevColumn;
    // let column, row;

    return function (e) {
        column = e.target.cellIndex;
        row = e.target.parentNode.rowIndex;

        if (pressed) {
            if (canPlayerStep(row, column, prevRow, prevColumn)) {
                redraw();
            }
            pressed = false;
            prevColumn = null;
            prevRow = null;
        } else if (!pressed && clickPlayerPawn(row, column)) {
            pressed = true;
            prevColumn = e.target.cellIndex;
            prevRow = e.target.parentNode.rowIndex;

            console.log('player was clicked');
        }
    };
    // getAvailablePaths(row, column);
    // console.log(row, column);
}

function canPlayerStep(row, column, prevRow, prevColumn) {
    var result = false;

    if (prevColumn == column && prevRow - row == 1) {
        //клик на клетку вперед
        if (!currentState.position.computer.find(function (pos) {
            return pos[0] == row && pos[1] == column;
        })) {
            //если впереди клетка пустая
            console.log('player move forward');
            currentState.position.player = currentState.position.player.map(function (pos) {
                if (pos[0] == prevRow && pos[1] == prevColumn) {
                    result = true;
                    console.log('player moved forward');
                    return [row, column];
                }
                return [pos[0], pos[1]];
            });
        }
    } else if (Math.abs(prevColumn - column) == 1 && prevRow - row == 1) {
        //клик на противника
        currentState.position.computer = currentState.position.computer.map(function (pos) {
            if (pos[0] == row && pos[1] == column) {
                result = true;
                currentState.position.player = currentState.position.player.map(function (playerPos) {
                    if (playerPos[0] == prevRow && playerPos[1] == prevColumn) {
                        return [row, column];
                    }
                    return [playerPos[0], playerPos[1]];
                });
                console.log('player step on computer');
                return [null, null];
            }
            return [pos[0], pos[1]];
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

function getAvailablePaths(row, column) {
    console.log(currentState);
}

document.addEventListener("DOMContentLoaded", contentLoaded);