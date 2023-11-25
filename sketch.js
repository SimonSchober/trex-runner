var PLAY = 1
var END = 0
var gamestate = PLAY
var trex, trex_running
var ground, groundImg
var invisible_ground
var cloud, cloudImg
var ob1, ob2, ob3, ob4, ob5, ob6
var cloudsGroup, obstaclesGroup
var count = 0
var trex_collided
var gameOver, gameOver_img
var restart, restart_img
var jump_sound

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  groundImg = loadImage("ground2.png")
  cloudImg = loadImage("cloud.png")
  ob1 = loadImage("obstacle1.png")
  ob2 = loadImage("obstacle2.png")
  ob3 = loadImage("obstacle3.png")
  ob4 = loadImage("obstacle4.png")
  ob5 = loadImage("obstacle5.png")
  ob6 = loadImage("obstacle6.png")
  trex_collided = loadImage("trex_collided.png")
  gameOver_img = loadImage("gameOver.png")
  restart_img = loadImage("restart.png")
  jump_sound = loadSound("jump.mp3")
}

function setup() {
  createCanvas(600, 300);
  trex = createSprite(200, 170)
  trex.addAnimation("running", trex_running)
  trex.scale = 0.5
  trex.addAnimation("collided", trex_collided)
  ground = createSprite(300, 190)
  ground.addImage("ground", groundImg)
  ground.x = ground.width / 2

  invisible_ground = createSprite(300, 200, 600, 10)
  invisible_ground.visible = false;

  
  cloudsGroup = new Group()
  obstaclesGroup = new Group()
  trex.setCollider("circle", 0, 0, 40)

  gameOver = createSprite(280, 120)
    restart = createSprite(280, 150)
    gameOver.scale = 0.5
    restart.scale = 0.5
    gameOver.addImage("Over", gameOver_img)
    restart.addImage("restart", restart_img)
    gameOver.visible = false
    restart.visible = false
}

function draw() {
  //trex.debug = true;
  background(255);

  if (gamestate === PLAY) {
    trex.collide(invisible_ground)
    
    //trex Gravity
    trex.velocityY = trex.velocityY + 0.5

    if (ground.x < 0) {
      ground.x = ground.width / 2
    }
   
    ground.velocityX = -8
    count = count + Math.round(frameRate() / 60)

    spawnObstacles();
    spawnClouds();

    if (trex.isTouching(obstaclesGroup)) {
      gamestate = END
    }
  }
  else if (gamestate === END) {
    ground.velocityX = 0
    trex.velocityY = 0
    cloudsGroup.setVelocityXEach(0)
    obstaclesGroup.setVelocityXEach(0)
    trex.changeAnimation("collided", trex_collided)
    cloudsGroup.setLifetimeEach(-1)
    obstaclesGroup.setLifetimeEach(-1)
   cloudsGroup.setDepthEach(0) 
    
  
    gameOver.visible = true
    restart.visible = true
    if (mousePressedOver(restart)) {
      reset()
    }
  }



  drawSprites();
  Counter();
}

function reset() {
  gamestate = PLAY
      count = 0
      obstaclesGroup.destroyEach()
      cloudsGroup.destroyEach()
      gameOver.visible = false
      restart.visible = false
      trex.changeAnimation("running", trex_running)
}

function mouseClicked() {
  if (trex.y > 170) {
    trex.velocityY = -8
    jump_sound.play(2)
  }
}


function spawnClouds() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 50)
    cloudsGroup.add(cloud)
    cloud.addImage("cloud.png", cloudImg)
    cloud.velocityX = -5
    cloud.y = Math.round(Math.random() * 150)
    cloud.lifetime = 150
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1
    console.log(cloud.depth)
  }
}

function spawnObstacles() {
  if (frameCount % 70 === 0) {
    var obstacle = createSprite(600, 175)
    obstacle.scale = 0.5
    obstacle.velocityX = -(8 + count / 100)
    obstacle.lifetime = 75
    obstaclesGroup.add(obstacle)
    var rand = Math.ceil(Math.random() * 6)
    switch (rand) {
      case 1: obstacle.addImage(ob1)
        break
      case 2: obstacle.addImage(ob2)
        break
      case 3: obstacle.addImage(ob3)
        break
      case 4: obstacle.addImage(ob4)
        break
      case 5: obstacle.addImage(ob5)
        break
      case 6: obstacle.addImage(ob6)
        break
      default: break
    }
  }
}

function Counter() {
  textSize(18);
  textFont("Georgia")
  text("Score: " + count, 450, 15)
}

// function counter() {
//   var count = World.frameCount
//   textSize(18);
//   textFont("Georgia");
//   text("Score: " + count, 450, 15)
// }


