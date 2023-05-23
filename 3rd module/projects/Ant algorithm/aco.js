
var refreshButton = document.getElementById('refresh-button');
        refreshButton.addEventListener('click', function() {
            location.reload();
        });



const canvas = document.getElementById('tspCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const numberOfCities = 30;
const numberOfAnts = 50;
const alpha = 1;
const beta = 5;
const evaporationRate = 0.5;
const iterations = 100;

// Generate cities
const cities = [...Array(numberOfCities)].map(() => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
}));

// Calculate distances between cities
const distances = cities.map(city1 =>
  cities.map(city2 =>
    Math.sqrt(Math.pow(city2.x - city1.x, 2) + Math.pow(city2.y - city1.y, 2)),
  ),
);

// Initialize pheromones
const pheromones = distances.map(row => row.map(() => 1));

function drawCities() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cities.forEach(city => {
    ctx.beginPath();
    ctx.arc(city.x, city.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
  });
}

function drawPath(path) {
  ctx.beginPath();
  ctx.moveTo(cities[path[0]].x, cities[path[0]].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(cities[path[i]].x, cities[path[i]].y);
  }
  ctx.lineTo(cities[path[0]].x, cities[path[0]].y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'blue';
  ctx.stroke();
}

function antAlgorithm() {
  let bestPath;
  let bestPathLength = Number.MAX_VALUE;

  for (let iter = 0; iter < iterations; iter++) {
    const antPaths = [];

    for (let ant = 0; ant < numberOfAnts; ant++) {
      let unvisited = [...Array(numberOfCities)].map((_, i) => i);
      let currentCity = unvisited.splice(Math.floor(Math.random() * unvisited.length), 1)[0];
      const antPath = [currentCity];

      while (unvisited.length > 0) {
        const probabilities = unvisited.map(city => {
          const pheromone = Math.pow(pheromones[currentCity][city], alpha);
          const distance = Math.pow(1 / distances[currentCity][city], beta);
          return pheromone * distance;
        });
        const sum = probabilities.reduce((acc, prob) => acc + prob, 0);
        const probabilitiesNormalized = probabilities.map(prob => prob / sum);

        const random = Math.random();
        let cumulativeProbability = 0;
        for (let i = 0; i < probabilitiesNormalized.length; i++) {
          cumulativeProbability += probabilitiesNormalized[i];
          if (random <= cumulativeProbability) {
            currentCity = unvisited.splice(i, 1)[0];
            antPath.push(currentCity);
            break;
          }
        }
      }

      antPaths.push(antPath);
    }

    // Update pheromones
    for (const path of antPaths) {
      const pathLength = path.reduce(
        (sum, city, index) =>
          sum + distances[city][index === path.length - 1 ? path[0] : path[index + 1]],
        0,
      );
      if (pathLength < bestPathLength) {
        bestPathLength = pathLength;
        bestPath = path;
        drawCities();
        drawPath(bestPath);
      }

      for (let i = 0; i < path.length; i++) {
        const city1 = path[i];
        const city2 = i === path.length - 1 ? path[0] : path[i + 1];
        pheromones[city1][city2] += 1 / pathLength;
        pheromones[city2][city1] += 1 / pathLength;
      }
    }

    // Evaporate pheromones
    for (let i = 0; i < numberOfCities; i++) {
      for (let j = i + 1; j < numberOfCities; j++) {
        pheromones[i][j] *= 1 - evaporationRate;
        pheromones[j][i] *= 1 - evaporationRate;
      }
    }
  }
}

startButton.addEventListener('click', () => {
  drawCities();
  antAlgorithm();
});