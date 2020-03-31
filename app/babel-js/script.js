'use strict';

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
    pos = currentState.position;
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