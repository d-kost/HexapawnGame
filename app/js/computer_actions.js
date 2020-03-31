function makeComputerStep() {
    
    // if (!savedPositions.includes(currentState)){ //переделать
    let saved = getSavedPosition();
    console.log('saved', saved);
    if (!saved){
        const steps = getAvailableSteps();
        //if steps is empty => player win

        let stateArray = getStateArray();
        saved = {
            // position: currentState.position,
            stateArray: stateArray,
            steps: steps,
            winningSteps: [],
            losingSteps: []
        }
        savedPositions.push(saved);
        console.log('steps', saved.steps);
    }

    let randomStepIndex = Math.floor(Math.random()*saved.steps.length);
    changePosition(saved.steps[randomStepIndex]);
    redraw();

}

function changePosition(newPosition) {
    currentState.position.computer = currentState.position.computer.map(pos => {
        if (newPosition && pos[0] == newPosition.row && pos[1] == newPosition.column) {     
            return [newPosition.dest_row, newPosition.dest_column]
        }
        return pos
    })

    //rewrite player's pawns
    currentState.position.player = currentState.position.player.filter( playerPos => {
        if (!(playerPos[0] == newPosition.dest_row && playerPos[1] == newPosition.dest_column)) {
            return playerPos
            // return [null, null];
        }
        // return [playerPos[0], playerPos[1]];
    })
}

function getSavedPosition() {
    let currentStateArray = getStateArray();
    let saved = savedPositions.filter( saved => saved.stateArray == currentStateArray);
  
    console.log('saved f', saved);
    if (saved.length == 0) {
        return null
    } else {
        return saved[0]
    }
    
    // let saved = savedPositions.filter( saved => saved.position == currentPos);
    // if (saved.length == 0) {
    //     return null
    // } else {
    //     return saved[0]
    // }
}

function getAvailableSteps() {
    let result = [];
    let stateArray = getStateArray();
    
    currentState.position.computer.forEach(pos => {
        // if (pos[0] != null && pos[1] != null) {
            const players = ['c', 'p'];
            const row_forward = pos[0]+1;
            const column_forward = pos[1]+1;
            const column_back = pos[1]-1;

            const array_row_forward = stateArray[row_forward];
            if (array_row_forward) {
                //check cell in front
                if (!players.includes(array_row_forward[pos[1]])) {
                    result.push({
                        row: pos[0],
                        column: pos[1],
                        dest_row: row_forward,
                        dest_column: pos[1]
                    })
                }
                //check cells diagonally
                checkDiagonal(array_row_forward, column_forward, pos);
                checkDiagonal(array_row_forward, column_back, pos);
            }
        // }
    })

    return result;

    function checkDiagonal(array, col, pos) {
        if (array[col] && array[col] == 'p') {
            result.push({
                row: pos[0],
                column: pos[1],
                dest_row: pos[0]+1,
                dest_column: col
            })
        }
    }
}


function getStateArray() {
    let result = [[],[],[]];
    currentState.position.computer.forEach(pos => {
        // if (pos[0] != null && pos[1] != null) {
            result[pos[0]][pos[1]] = 'c'
        // }
    });

    currentState.position.player.forEach(pos => {
        // if (pos[0] != null && pos[1] != null) {
            result[pos[0]][pos[1]] = 'p'
        // }      
    });
    return result;
}