var bg, bgImage;
var monkey, monkey_running;
var ground;
var obstacle, ob1, ob2, ob3, ob4, obGroup;
var food, f1, f2, f3, f4, f5, foodGroup;

var over, overImg;
var reset, resetImg;

var gameState = "play";
var score = 0;
var death = 0;

function preload() {
  bgImage = loadImage("bg2.jpg")

  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png")

  ob1 = loadImage("obstacle.png");
  ob2 = loadImage("obstacle.png");
  ob3 = loadImage("obstacle.png");
  ob4 = loadImage("obstacle.png");

  f1 = loadImage("banana.png");
  f2 = loadImage("banana.png");

  stop = loadAnimation("sprite_1.png");

  overImg = loadImage("over2.png");
  resetImg = loadImage("reset.jpg");
}

function setup() {
  createCanvas(600, 430);

  bg = createSprite(520, 200, 500, 400);
  bg.addImage("bg", bgImage);
  bg.scale = 1;


  monkey = createSprite(100, 360, 20, 20);
  monkey.addAnimation("run", monkey_running);
  monkey.setCollider("circle", -30, 10, 300);
  monkey.debug = false;

  monkey.scale = 0.1;

  over = createSprite(300, 200, 20, 20);
  reset = createSprite(300, 270, 20, 20);

  ground = createSprite(450, 380, 800, 10);
  ground.visible = false;

  obGroup = new Group();
  foodGroup = new Group();
}

function draw() {
  background(200)
  drawSprites();

  fill("blue");
  textSize(20);
  text("Score:" + score, 500, 20);

  fill("black");
  textSize(20);
  text("DEATH:" + death, 10, 20);

  //sprites collide with ground
  monkey.collide(ground);

  if (gameState === "play") {
    over.visible = false;
    reset.visible = false;

    bg.velocityX = -4;
    ground.velocityX = -3;


    if (bg.x < 0) {
      bg.x = bg.width / 2;
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (keyDown("space")) {
      monkey.velocityY = -9;
    }
    //gravity 
    monkey.velocityY = monkey.velocityY + 0.5;

    if (monkey.isTouching(obGroup)) {
      death = death + 1;
    }

    if (monkey.isTouching(foodGroup)) {
      foodGroup.destroyEach();
      score = score + 1;
    }

    if (monkey.isTouching(obGroup)) {
      gameState = "over";
    }

    //customize functions
    obstacle();
    banana();
  }

  if (gameState === "over") {

    over.visible = true;
    reset.visible = true;

    over.addImage("finish", overImg)
    over.scale = 0.6;
    over.visible = true;


    reset.addImage("restart", resetImg);
    reset.scale = 0.2;
    reset.visible = true;

    bg.velocityX = 0;
    foodGroup.setVelocityXEach(0);
    obGroup.setVelocityXEach(0);
    monkey.velocityY = 0;
    monkey.addAnimation("monkeystop", stop);
    monkey.changeAnimation("monkeystop", stop);

    if (mousePressedOver(reset)) {
      restart();
    }
  }
}

function restart() {
  gameState = "play";
  obGroup.destroyEach();
  foodGroup.destroyEach();
  monkey.changeAnimation("run", monkey_running);
  score = 0;
}

function obstacle() {
  if (frameCount % 100 === 0) {
    var obstacle = createSprite(600, 340, 20, 20);
    obstacle.setCollider("circle", 4, 90, 250)
    obstacle.debug = false;
    obstacle.velocityX = -(12 + (score / 5));
    var s = Math.round(random(1, 2))
    switch (s) {
      case 1:
        obstacle.addImage("ob", ob1);
        break;
      case 2:
        obstacle.addImage("ob", ob2);
        break;
      case 3:
        obstacle.addImage("ob", ob3);
        break;
      case 4:
        obstacle.addImage("ob", ob4);
        break;
      default:
        break;
    }
    obGroup.add(obstacle);
    obstacle.scale = 0.2;
    obstacle.lifetime = -1;
  }
}

function banana() {
  if (frameCount % 80 === 0) {
    var s = Math.round(random(1, 2))
    switch (s) {
      case 1:
        food = createSprite(600, 470, 20, 20)
        food.addImage("food", f1);
        food.velocityX = -(12 + (score / 5));
        food.y = Math.round(random(120, 180));
        break;
      case 2:
        food = createSprite(600, 470, 20, 20)
        food.addImage("food", f2);
        food.velocityX = -(12 + (score / 5));
        food.y = Math.round(random(150, 200));
        break;
      default:
        break;
    }
    over.depth = food.depth;
    over.depth = over.depth + 1;
    foodGroup.add(food);
    food.scale = 0.1;
    food.lifetime = -1;
  }
}