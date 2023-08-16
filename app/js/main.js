// let board = [[3, 2, 3, 2, 3, 2, 3, 2],
//             [2, 3, 2, 3, 2, 3, 2, 3],
//             [3, 2, 3, 2, 3, 2, 3, 2],
//             [0, 3, 0, 3, 0, 3, 0, 3],
//             [3, 0, 3, 0, 3, 0, 3, 0],
//             [1, 3, 1, 3, 1, 3, 1, 3],
//             [3, 1, 3, 1, 3, 1, 3, 1],
//             [1, 3, 1, 3, 1, 3, 1, 3]]

let board = [[3, 0, 3, 0, 3, 0, 3, 0],
            [0, 3, 0, 3, 0, 3, 0, 3],
            [3, 1, 3, 0, 3, 0, 3, 0],
            [0, 3, 0, 3, 0, 3, 0, 3],
            [3, -1, 3, 0, 3, 0, 3, 0],
            [0, 3, -2, 3, 0, 3, 0, 3],
            [3, 0, 3, 0, 3, 0, 3, 0],
            [0, 3, 0, 3, 0, 3, 0, 3]]


const boardElement = document.querySelector('.board')

function generateBoardView(){
    htmlBoard = ''
    for(i = 0; i < board.length; i++){
        for(j = 0; j < board[i].length; j++){
            if (board[i][j] === 3) htmlBoard += `<div class="area white" posX="${j}" posY="${i}"></div>`
            else htmlBoard += `<div class="area" posX="${j}" posY="${i}"></div>`
        }
    }
    boardElement.innerHTML = htmlBoard
}

generateBoardView()


const areas = document.querySelectorAll('.area')

const cssElements = [
    'pawn-white',
    'pawn-black',
    'og-pawn'
]

let cords = { 
    'x1' : null,
    'y1' : null,
    'x2' : null,
    'y2' : null,
    'player' : null,
    'beatingProcess' : false
}

let currnetPlayer = 2;

function didSomeoneWin(){
    let enemyPlayer = 2
    if ( cords['player'] === 2 ) enemyPlayer = 1

    for(i = 0; i < board.length; i++){
        for(j = 0; j < board[i].length; j++){
            if (Math.abs(board[i][j]) === enemyPlayer) return false
        }
    }

    return true 
}

function changePlayer(){
    if (currnetPlayer === 1) currnetPlayer = 2
    else currnetPlayer = 1
}

function getCords(element){
    let x = parseInt(element.currentTarget.getAttribute('posX'))
    let y = parseInt(element.currentTarget.getAttribute('posY'))
    let boardValue = board[y][x]

    if(cords['x1'] === null){
        if(boardValue === 0 || Math.abs(boardValue) !== currnetPlayer) return
        cords['player'] = boardValue
        cords['x1'] = x
        cords['y1'] = y
    } else if (cords['x2'] === null){
        if (board[cords['y1']][cords['x1']] < 0) 
            if ( boardValue === 3){
                cords['x2'] = x
                cords['y2'] = y
                return
            }

        if (boardValue !== 0) return
        cords['x2'] = x
        cords['y2'] = y
    }
    console.log(cords)
}

function upDateBoard(){
    for(i = 0; i < 8; i++){
        for(j = 0; j < 8; j++){
            //if (board[i][j] === 3) continue
            if (board[i][j] === 0 || board[i][j] === 3) {
                areas[i * 8 + j].classList.remove(cssElements[0])
                areas[i * 8 + j].classList.remove(cssElements[1])
                continue
            }
            if (board[i][j] === -1 || board[i][j] === -2) {
                areas[i * 8 + j].classList.add(cssElements[board[i][j] * -1 - 1])   
                areas[i * 8 + j].classList.add('og-pawn')
            }
            areas[i * 8 + j].classList.add(cssElements[board[i][j] - 1])            
        }
    }
}

function isClassicMoveCorrect(){
    let x = -1
    if (cords['player'] === 2) x = 1
        
    if (cords['y1'] + x  === cords['y2']){
            if( (cords['x1'] - 1 === cords['x2']) ||
                (cords['x1'] + 1 === cords['x2']) ) 
        return true
    }
    
    return false
}

function isNextBeatAvailable(x, enemyPlayer){    

    let bx = null
    let by = null

    for(i = 0; i < 4; i++){    
        by = cords['y2'] + x[0][i]
        bx = cords['x2'] + x[1][i]

        if (by > 0 && by < 7 && bx > 0 && bx < 7)
            if(board[by][bx] === 0)      
                if(Math.abs(board[cords['y2'] + x[2][i]][cords['x2'] + x[3][i]]) === enemyPlayer) return true
    }
    
    return false
}


function isBeatMoveCorrect(){
    let enemyPlayer = 2
    if ( cords['player'] === 2 ) enemyPlayer = 1
    
    let x = [
        [2, -2, 2, -2], 
        [2, -2, -2, 2], 
        [1, -1, 1, -1], 
        [1, -1, -1, 1]] 

    for(i = 0; i < 4; i++){
        if( cords['y1'] === cords['y2'] + x[0][i] )
            if ( cords['x1'] === cords['x2'] + x[1][i] )
                if(Math.abs(board[cords['y1'] - x[2][i]][cords['x1'] - x[3][i]]) === enemyPlayer){
                    board[cords['y1'] - x[2][i]][cords['x1'] - x[3][i]] = 0
                    cords['beatingProcess'] = isNextBeatAvailable(x, enemyPlayer)
                    return true
                }
    }

    return false
}

function isOgMoveCorrect(){
    let hy = null
    let hx = null
    let ileRuchow = 0
    if (cords['y1'] === cords['y2'] || cords['x1'] === cords['x2'] ||
        Math.abs(cords['y1'] - cords['y2']) === Math.abs(cords['x1'] - cords['x2']))
        hy = cords['y1']
        hx = cords['x1']
        while (hy !== cords['y2'] || hx !== cords['x2']){
            if (hy < cords['y2']) hy += 1
            if (hy > cords['y2']) hy -= 1
            if (hx < cords['x2']) hx += 1
            if (hx > cords['x2']) hx -= 1
            //board[][] ? currentPlayer => ...
            ileRuchow++
            console.log(ileRuchow)
        }
        return true

} // ----------------------------------------------------- dodac sprawdzanie po ruchu 

function upgradeToOgPawn(){
    for(i = 0; i < board[0].length; i++){
        if(board[0][i] === 1) board[0][i] = -1
        if(board[7][i] === 2) board[7][i] = -2
    }

}

function areCordsCorrect(){
    if(cords['x2'] === null) return false
    
    if (board[cords['y1']][cords['x1']] < 0)  
        if (isOgMoveCorrect()){
            console.log("og move is correct")
            changePlayer()
            return true
        } else return false

    if( (!cords['beatingProcess'] && isClassicMoveCorrect()) || isBeatMoveCorrect() ) {
        if (!cords['beatingProcess']){
            upgradeToOgPawn()/////////////////////////////////////////////////////////////////////////////////////////////////////not working
            console.log('dziala')
            changePlayer() 
            }
        return true
    }
    
}

function move(){
    board[cords['y1']][cords['x1']] = 0
    board[cords['y2']][cords['x2']] = cords['player'] 
}


upDateBoard()



for(i = 0; i < areas.length; i++){
    areas[i].addEventListener('click', e => {
        getCords(e)
        if(areCordsCorrect()){
            move()
            upDateBoard()
        } 
        if(didSomeoneWin()){
            console.log('gracz nr.', cords['player'], 'wygrał!') 

        }
        if(cords['x2'] !== null) {
            cords = { 
                'x1' : null,
                'y1' : null,
                'x2' : null,
                'y2' : null,
                'player' : null,
                'beatingProcess' : cords['beatingProcess'] 
            }
        }
    })
}