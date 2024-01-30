GA = [
    [1, 1, 3],
    [2, 2, 3],
    [1, 1, 3]
]

let winner = false;

GA.forEach(row => {
   if (!row.includes(undefined) && new Set(row).size == 1){
    console.log('win rows');
    winner = true
   }
});


var diag1 = []
var diag2 = []

for (let i = 0; i<GA.length; i++){
    let rowSize = GA[i].length - 1
    diag1.push(GA[i][i])
    diag2.push(GA[i][rowSize-i])

}

if (!diag1.includes(undefined) && new Set(diag1).size == 1){
    winner = true
    console.log('diag1 win');
}

if (!diag2.includes(undefined) && new Set(diag2).size == 1){
    winner = true
    console.log('diag2 win');
}

var column0 = [GA[0][0], GA[1][0], GA[2][0]]
var column1 = [GA[0][1], GA[1][1], GA[2][1]]
var column2 = [GA[0][2], GA[1][2], GA[2][2]]

if (!column0.includes(undefined) && new Set(column0).size == 1){
    winner = true
    console.log('column 0 win');
}

if (!column1.includes(undefined) && new Set(column1).size == 1){
    winner = true
    console.log('column1 win');
}

if (!column2.includes(undefined) && new Set(column2).size == 1){
    winner = true
    console.log('column2 win');
}

console.log(winner);