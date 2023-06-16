const board = document.getElementById('board');
const cellElements = document.querySelectorAll('[data-cell]');
const xClass = 'x';
const circleClass = 'o';
const winningScreen = document.getElementById('winningScreen')
const winningMessage = document.querySelector('[data-winning-message-text]');

/* 
Board Setup:
 0 | 1 | 2  
------------
 3 | 4 | 5  
------------
 6 | 7 | 8  

essentially an array 
*/

const winningCombinations = [
    // Horizontal Wins
    [0, 1, 2], 
    [3, 4, 5],
    [6, 7, 8],
    // Vertical Wims
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagnol Wins
    [0, 4, 8],
    [2, 4, 6]
]

let circleTurn;



function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        // remove all pieces from the board
        cell.classList.remove(xClass); 
        cell.classList.remove(circleClass);

        // Remove any event lisnter to handle the clicks
        cell.removeEventListener('click', handleClick);

        // Event happens ONLY ONCE + re-add event listener
        cell.addEventListener('click', handleClick, {once: true});
    })
    setHoverEffect();
    winningScreen.classList.remove('show');

}

// Procedure:
    // Place Mark
    // Check For Win
    // Check For Draw
    // Switch Turns
    // Set Hover Effect

function handleClick(e) {
    // console.log('clicked');
    const cell = e.target;
    const currentClass = circleTurn ? circleClass : xClass;
    placeMark(cell, currentClass);

    if (checkWin(currentClass)) endGame(false);
    else if (isDraw()) endGame(true);
    else {
        switchTurns();
        setHoverEffect(); // Must be after switchTurns(); to make sure it's the current players turn, not the previous
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function switchTurns() {
    circleTurn = !circleTurn;
}

function setHoverEffect() {
    board.classList.remove(xClass);
    board.classList.remove(circleClass);
    if (circleTurn) board.classList.add(circleClass);
    else board.classList.add(xClass);
}

function checkWin(currentClass) {
    // .some returns true if any of the values inside of it are true
    return winningCombinations.some(combination => {
        // check if all values for every winning combination have the same class 
        return combination.every(index => {
            // check to see if the current class is in all 3 of the elemtns inside of the combination then you win
            return cellElements[index].classList.contains(currentClass);
        })
    })
}

function endGame(draw) {
    if (draw) {
        winningMessage.innerHTML = `Draw!`;
        winningScreen.classList.add('show');
    } else {
        winningMessage.innerHTML = `${circleTurn ? 'O wins!' : 'X wins!'}`;
        winningScreen.classList.add('show');
    }
}

function isDraw() {
    // Desrtcuture cellElements into an array to use .every method
    return [...cellElements].every(cell => {
        // check if every cell is filled
        return cell.classList.contains(xClass) || cell.classList.contains(circleClass);
    })
}

winningScreen.addEventListener('click', startGame);

startGame();