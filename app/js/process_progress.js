function onProgressChange(currentProgress) {
    //check win
    let [winner, availableSteps] = checkWin(currentProgress);
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
    const winner = {
        player: 'player',
        computer: 'computer'
    }
    //1. if on enemy side
    let enemySideResult = onEnemySide(progress, winner);
    if (enemySideResult) {
        return [enemySideResult, null]
    }

    //2. if there are no enemy pawns
    let pawns = checkPawns(winner);
    if (pawns) {
        return pawns;
    }

    //3. if there are no enemy available steps
    return checkAvailableSteps(progress, winner);
}

function onEnemySide(progress, winner) {
    let result = false;

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
        let result = false;
        array.forEach(pos => {
            if (pos[0] == enemyRow) {                
                result = true;
            }
        })
        return result;
    }
    
}

function checkPawns(winner) {
    let result = false;
    if (currentState.position.computer.length == 0) {
        result = [winner.player, null];
    }
    if (currentState.position.player.length == 0) {
        result = [winner.computer, null];
    }
    return result;
}

function checkAvailableSteps(progress, winner) {
    let result;
    const winner_param = winner;
    if (progress % 2 == 1) {
        check(currentState.position.computer, 'c');
    } else {
        check(currentState.position.player, 'p');
    }
    return result;

    function check(array, flag) {
        let availableSteps = getAvailableSteps(array, flag);
        if (availableSteps.length > 0) {
            result = [false, availableSteps];
        } else {
            let winner = flag == 'c' ? winner_param.player : winner_param.computer;
            result = [winner, null];
        }
    }
}