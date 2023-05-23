// Define the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Define the Ant class
class Ant {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.direction = Math.random() * 2 * Math.PI;
    this.hasFood = false;
  }

  move() {
    if (this.hasFood) {
      this.direction = Math.atan2(canvas.height / 2 - this.y, canvas.width / 2 - this.x);
    } else {
      let foodSources = food.filter(f => !f.isTaken);
      if (foodSources.length > 0) {
        let closestFood = foodSources.reduce((closest, f) => {
          let distance = Math.sqrt(Math.pow(f.x - this.x, 2) + Math.pow(f.y - this.y, 2));
          if (distance < closest.distance) {
            return { food: f, distance: distance };
          } else {
            return closest;
          }
        }, { food: null, distance: Infinity }).food;
        if (closestFood !== null) {
          this.direction = Math.atan2(closestFood.y - this.y, closestFood.x - this.x);
          if (Math.sqrt(Math.pow(closestFood.x - this.x, 2) + Math.pow(closestFood.y - this.y, 2)) < 5) {
            closestFood.isTaken = true;
            this.hasFood = true;
          }
        } else {
          this.direction += (Math.random() - 0.5) * Math.PI / 4;
        }
      } else {
        this.direction += (Math.random() - 0.5) * Math.PI / 4;
      }
    }

    const speed = 5;
    const nextX = this.x + Math.cos(this.direction) * speed;
    const nextY = this.y + Math.sin(this.direction) * speed;

    // Check if the next position is outside the canvas boundaries
    if (nextX < 0 || nextX > canvas.width || nextY < 0 || nextY > canvas.height) {
      // Adjust the direction to move away from the boundary
      this.direction += Math.PI;
    } else {
      // Move normally
      this.x = nextX;
      this.y = nextY;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    if (this.hasFood) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "black";
    }
    ctx.fill();
  }
}

// Define the Food class
class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isTaken = false;
  }

  draw() {
    if (this.isTaken) {
      return; // don't draw taken food
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "green";
    ctx.fill();
  }
}

// Define the Home class
class Home {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
  }
}

// Define the variables
let ants = [];
let food = [];

// Define the startSimulation function
function startSimulation() {
  ants = [];
  for (let i = 0; i < parseInt(document.getElementById("numAnts").value); i++) {
    ants.push(new Ant(canvas.width / 2, canvas.height / 2));
  }

  // Create a home at the center of the canvas
  const home = new Home(canvas.width / 2, canvas.height / 2);

  let isPlacingFood = false;
  canvas.addEventListener("mousedown", e => {
    if (!isPlacingFood && e.button === 0) {
      isPlacingFood = true;
    }
  });
  canvas.addEventListener("mousemove", e => {
    if (isPlacingFood) {
      food.push(new Food(e.offsetX, e.offsetY));
    }
  });
  canvas.addEventListener("mouseup", e => {
    isPlacingFood = false;
  });

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    home.draw(); // Draw the home
    food.forEach(f => f.draw());
    ants.forEach(a => {
      a.move();
      a.draw();
      
      // Check if the ant has reached the home with food
      if (a.hasFood && Math.sqrt(Math.pow(home.x - a.x, 2) + Math.pow(home.y - a.y, 2)) < home.size) {
        a.hasFood = false;
      }
    });
  }, 50);
}





var refreshButton = document.getElementById('refresh-button');
        refreshButton.addEventListener('click', function() {
            location.reload();
        });
