let player, computer, currentState;
let savedPositions = [];

function contentLoaded() {
    initGame();
    addEventsToPawn();
    redraw();



    document.querySelector('#newGameBtn').addEventListener('click', newGameClick); 
}

function initGame() {
    player = [[2, 0], [2, 1], [2, 2]]
    
    computer = [[0, 0], [0, 1], [0, 2]]
    
    currentState = {
        step: 0,
        position : {
            player,
            computer
        },
        history,
    }

    // let state = [['b', 'b', 'b'],
    //             ['empty', 'empty', 'empty'],
    //             ['g', 'g', 'g']]

    // return state;
}

function newGameClick() {
    console.log('dfsf');
    
    initGame();
    redraw();
}

function redraw() {
    pos = currentState.position;
    let field = document.querySelector('#field');
    Array.from(field.rows).forEach(row => {
        Array.from(row.cells).forEach( cell => {    
            cell.classList.remove('player', 'computer');
        })
    });
    
    pos.computer.forEach(coords => {
        if (coords[0] != null && coords[1] != null){
            field.rows[coords[0]].cells[coords[1]].classList.add('computer');
        }  
    })
    
    pos.player.forEach(coords => {
        if (coords[0] != null && coords[1] != null){
            field.rows[coords[0]].cells[coords[1]].classList.add('player');
        }
        
    })
    // console.log(field.rows[0].cells[1].classList.remove(''));
    

}

function addEventsToPawn() {
    let pawns = document.querySelectorAll('.pawn');
    const makeStep = makePlayerStep(); 
    Array.from(pawns).forEach(pawn => pawn.addEventListener('click', e => makeStep(e)))
}



document.addEventListener("DOMContentLoaded", contentLoaded);