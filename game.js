let gameboard = (function(){
    let gameArea = [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
    ]
    const getArea = () =>  gameArea
    const addingValue = (indexY, indexX, Value='X') => gameArea[indexY].splice(indexX, 1, Value)
    
    const clearGameArea = () =>{
        gameArea = [
            [undefined, undefined, undefined],
            [undefined, undefined, undefined],
            [undefined, undefined, undefined],
        ]

    }
    return {getArea, addingValue, clearGameArea}
})();

let player1;
let player2;

function player(name, playerValue='X'){
    let wincounter = 0
    const increaseWinCounter = ()=> wincounter++
    const getWinCounter = ()=> wincounter
    return {name, playerValue, increaseWinCounter, getWinCounter}
}

function wichPlayer(player){
    if (player.playerValue == player1.playerValue){
        return {player: player1, name:'player1'}
    }
    else {
        return {player: player2, name:'player2'}
    }
}

function render (){
    let area = gameboard.getArea()
    var index = 1
    area.forEach((row)=>{row.forEach( (cellValue) => {
        let thisCell = document.querySelector(`.gameCell:nth-child(${index})`) 
        // using replaceChildren + appendChild instead of innerhtml since its a better practice to avoid xss attack

        thisCell.replaceChildren()
        thisCell.appendChild(document.createTextNode(cellValue == undefined ? '' : cellValue)) 
        
        // thisCell.innerHTML = cellValue == undefined ? '' : cellValue
        index++
    })}
    )
}

function checWin(gameArea){
    let winState = false;
    let noRowUndefined = []
    gameArea.forEach(row => {
    if (!row.includes(undefined) && new Set(row).size == 1){
        console.log('win rows', row);
        winState = true
    }
    else if (!row.includes(undefined)){
        noRowUndefined.push(true)
    }
    });


    var diag1 = []
    var diag2 = []

    for (let i = 0; i<gameArea.length; i++){
        let rowSize = gameArea[i].length - 1
        diag1.push(gameArea[i][i])
        diag2.push(gameArea[i][rowSize-i])

    }

    if (!diag1.includes(undefined) && new Set(diag1).size == 1){
        winState = true
        console.log('diag1 win', diag1);
    }

    if (!diag2.includes(undefined) && new Set(diag2).size == 1){
        winState = true
        console.log('diag2 win', diag2);
    }

    var column0 = [gameArea[0][0], gameArea[1][0], gameArea[2][0]]
    var column1 = [gameArea[0][1], gameArea[1][1], gameArea[2][1]]
    var column2 = [gameArea[0][2], gameArea[1][2], gameArea[2][2]]

    if (!column0.includes(undefined) && new Set(column0).size == 1){
        winState = true
        console.log('column 0 win', column0);
    }

    if (!column1.includes(undefined) && new Set(column1).size == 1){
        winState = true
        console.log('column1 win', column1);
    }

    if (!column2.includes(undefined) && new Set(column2).size == 1){
        winState = true
        console.log('column2 win', column2);
    }

    if (!diag1.includes(undefined) && !diag2.includes(undefined) && !column0.includes(undefined) && !column1.includes(undefined) && !column2.includes(undefined) && noRowUndefined.length == 3){
        console.log('ITS A DRAW');
        gameboard.clearGameArea()
    }

    console.log({winState});
    return winState
}

function win(player){
    let winner = wichPlayer(player).player
    winner.increaseWinCounter()
    updtFormValues(winner)
    gameboard.clearGameArea()
    render()
}

function getClickIndex(cell){
    for (let i = 0; document.querySelector(`.gameCell:nth-child(${i})`) != cell ; i++){
        var index = i
        if (i >= 10) {
            return undefined
        }
    }
    return index + 1
}

function getPos(clickIndex){
    let remainder = clickIndex%3
    let quocient = clickIndex/3
    let posX = remainder == 0 ? 2 : remainder - 1
    let posY = Number.isInteger(quocient) ? quocient - 1 : Math.floor(quocient)
    return {posX, posY}
}

function addInput(event){
    //clear nesting !!!!!!!!
    if (event.target.classList.contains('gameCell')){
        let positions = getPos(getClickIndex(event.target))
        let playerTurn = this.playerTurn
        let gameArea = gameboard.getArea()

        if (gameArea[positions.posY][positions.posX] != undefined){
            console.log('occupied')
            window.alert('occupied space')
            return undefined
        }

        gameboard.addingValue(positions.posY, positions.posX, playerTurn.playerValue)
        console.log(gameboard.getArea());
        
        if (checWin(gameArea)){
            win(playerTurn)
            this.playerTurn = changeTurn(playerTurn)
        }
        
        else{
            render()
            this.playerTurn = changeTurn(playerTurn)
        }  
    }
}

function formError(event){
    event.preventDefault()
    const fdata = new FormData(event.target)
    const formFields =  Object.fromEntries(fdata)
    const namePlayer1 = formFields.player1Name
    const namePlayer2 = formFields.player2Name
    const valuePlayer1 = formFields.selectValuePlayer1
    const valuePlayer2 = formFields.selectValuePlayer2
    var formErrorValue = false;
    if (namePlayer1 == '' || namePlayer2 == ''){
        window.alert('PLEASE ENTER A VALID NAME')
        formErrorValue = true
    }
    if (valuePlayer1 == valuePlayer2){
        window.alert('PLAYER MUST HAVE DIFFERENT VALUES')
        formErrorValue = true
    }
    
    return {namePlayer1, namePlayer2, valuePlayer1, valuePlayer2, formErrorValue}
}

function changeTurn(player){
    let lastTurn = wichPlayer(player).name
    if (lastTurn =='player1'){

        let playerDiv = document.querySelector('.player2div')
        let playerDivOther = document.querySelector('.player1div')
        playerDiv.style.color = 'red'
        playerDivOther.style.color = 'black'
        return player2
    }
    else{

        let playerDiv = document.querySelector('.player1div')
        let playerDivOther = document.querySelector('.player2div')
        playerDiv.style.color = 'red'
        playerDivOther.style.color = 'black'
        return player1
    }
}

function insertFormValues(player1, player2){
    let player1name = document.querySelector('.player1NameInfo')
    let player1value = document.querySelector('.player1ValueInfo')
    let player1win = document.querySelector('.player1WinsInfo')

    let player2name = document.querySelector('.player2NameInfo')
    let player2value = document.querySelector('.player2ValueInfo')
    let player2win = document.querySelector('.player2WinsInfo')

    player1name.appendChild(document.createTextNode(player1.name))
    player1value.appendChild(document.createTextNode(player1.playerValue))
    player1win.appendChild(document.createTextNode(player1.getWinCounter()))

    player2name.appendChild(document.createTextNode(player2.name))
    player2value.appendChild(document.createTextNode(player2.playerValue))
    player2win.appendChild(document.createTextNode(player2.getWinCounter()))
}

function updtFormValues(player){
    let winner = wichPlayer(player).name
    console.log(`${winner}WinsInfo`);
    let playerWin = document.querySelector(`.${winner}WinsInfo`)
    playerWin.replaceChildren(document.createTextNode(player.getWinCounter()))
}

function game(event){
    let {namePlayer1, namePlayer2, valuePlayer1, valuePlayer2, formErrorValue} = formError(event);
    if (!formErrorValue){
        let formArea = document.querySelector('.formArea')
        let gameAreaselect = document.querySelector('.gameArea')
        let playerInfoDiv = document.querySelector('.playerInfo')

        gameAreaselect.style.display = 'grid'
        formArea.style.display = 'None'
        playerInfoDiv.style.display = 'flex'

        player1 = player(namePlayer1, valuePlayer1)
        player2 = player(namePlayer2, valuePlayer2)

        insertFormValues(player1, player2)

        var gameArea = document.querySelector('.gameArea')
        gameArea.playerTurn = player1
        let playerDiv = document.querySelector('.player1div')
        playerDiv.style.color = 'red'

        gameArea.addEventListener('click', addInput)

    }
}


var form = document.querySelector('#playerForms')


form.addEventListener('submit', game)
render()
