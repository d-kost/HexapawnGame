function makeComputerStep(availableSteps) {
    
    let saved = getSavedPosition();
    let stateArray;
    
    if (!saved){
        const steps = availableSteps;

        stateArray = getStateArray();
        saved = {
            stateArray: stateArray,
            steps: steps
        }
        savedPositions.push(saved);
    } else {
        stateArray = saved.stateArray;
    }

    //case when the winning step became a losing
    if (saved.steps.length == 0) {
        saved.steps = availableSteps;
    }

    let randomStepIndex = Math.floor(Math.random()*saved.steps.length);
    changePosition(saved.steps[randomStepIndex]);

    currentState.history.push({
        position: stateArray,
        chosenStep: saved.steps[randomStepIndex]
    })
    
    currentState.progress += 1;
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
        }
    })
}

function getSavedPosition() {
    let currentStateArray = getStateArray();
    let saved = savedPositions.filter( saved => compareArrays(saved.stateArray, currentStateArray));
  
    if (saved.length == 0) {
        return null
    } else {
        return saved[0]
    }

    function compareArrays(arr1, arr2) {
        let result = true;
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr1[i].length; j++) {
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
    let result = [[],[],[]];
    currentState.position.computer.forEach(pos => {
        result[pos[0]][pos[1]] = 'c'
    });

    currentState.position.player.forEach(pos => {
        result[pos[0]][pos[1]] = 'p'    
    });
    return result;
}