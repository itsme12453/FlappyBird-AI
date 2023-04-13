

function nextGeneration() {
    console.log("next generation");
    
    calculateFitness();

    for (let i = 0; i < POPULATION_TOTAL; i++) {
        players[i] = pickOne();
    }

    playersDup = [];
}

function pickOne() {
    let index = 0;
    let r = random(1);
    
    while (r > 0) { // >=
        r = r - playersDup[index].fitness;
        index++;
    }

    index--;
    
    let player = playersDup[index];
    let child = new Player(player.brain);

    child.mutate();

    return child;
}

// function pickOne() {

// }

function calculateFitness() {
    let sum = 0;

    for (let player of playersDup) {
        sum += player.score;
    }

    for (let player of playersDup) {
        player.fitness = player.score / sum;
    }
}