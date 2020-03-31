function makePlayerStep() {
    let pressed = false;
    let prevRow, prevColumn;
    let column, row;

    return function(e) {
        column = e.target.cellIndex;
        row = e.target.parentNode.rowIndex;

        if (currentState.winner == null) {
            if (pressed) {
                //if click in available steps
                if (canPlayerStep(row, column, prevRow, prevColumn)) {
                    redraw();
                    currentState.progress += 1;
                }
                pressed = false;
                prevColumn = null;
                prevRow = null;
    
    
            } else if (!pressed && clickPlayerPawn(row, column)) {
                pressed = true;
                prevColumn = e.target.cellIndex;
                prevRow = e.target.parentNode.rowIndex;
    
                console.log('player begin step'); 
            }
        }
    }
}

function canPlayerStep(row, column, prevRow, prevColumn) {
    let result = false;
    
    if (prevColumn == column && prevRow - row == 1) {
        //клик на клетку вперед
        if (!currentState.position.computer.find(pos => pos[0] == row && pos[1] == column)) {
            //если впереди клетка пустая
            currentState.position.player = currentState.position.player.map( pos => {
                if (pos[0] == prevRow && pos[1] == prevColumn) {
                    result = true;
                    console.log('player move forward');
                    return [row, column];
                }
                return [pos[0], pos[1]];
            })
        }

    } else if (Math.abs(prevColumn - column) == 1 && prevRow - row == 1) {
        //find click on computer
        currentState.position.computer = currentState.position.computer.filter( pos => {
            if (pos[0] == row && pos[1] == column) {
                result = true;
                console.log('player step on computer');
                //rewrite player if click was on computer
                currentState.position.player = currentState.position.player.map( playerPos => {
                    if (playerPos[0] == prevRow && playerPos[1] == prevColumn) {
                        return [row, column];
                    }
                    return playerPos;
                })
            } else {
                return pos;
            }
        })
    }
    return result;
}

function clickPlayerPawn(row, column) {
    let result = false;
    currentState.position.player.forEach( pos => {
        if (pos[0] == row && pos[1] == column) {
            result = true 
        } 
    })
    return result
}