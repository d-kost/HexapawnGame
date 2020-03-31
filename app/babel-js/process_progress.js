'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function onProgressChange(currentProgress) {
    //check win
    var _checkWin = checkWin(currentProgress),
        _checkWin2 = _slicedToArray(_checkWin, 2),
        winner = _checkWin2[0],
        availableSteps = _checkWin2[1];
    // console.log('winner', winner);


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
    var winner = {
        player: 'player',
        computer: 'computer'
        //1. if on enemy side
    };var enemySideResult = onEnemySide(progress, winner);
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