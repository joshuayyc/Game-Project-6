/*
The Game Project
Week 5 - Multiple Interactables*/

//declare variables
var floorPos_y;
var gameChar_x;
var gameChar_y;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var trees_x;
var treePos_y;
var clouds;
var mountain;
var cameraPosX;
var collectables;
var canyons;
var game_score;
var flagpole;
var lives;

function setup()
{
    //create canvas
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    startGame();
}

function draw()
{
    //set cameraPosX to follow game character position
    cameraPosX = gameChar_x-width/2;
    
    //create sky blue background
	background(100,155,255); 
    
	//draw some green ground
    noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y);
    
    //save current drawing style and transformations
    push();
    //specify x position translation based on cameraPosX position
    translate(-cameraPosX,0);
    
    //draw clouds in the sky using for loop based on array of objects
    drawClouds();
    
     //draw mountain in the distance using for loop based on array of objects
    drawMountains();
    
    //draw trees using for loop based on array of x positions
    drawTrees();
  
    //draw and check canyon
    for (var i=0; i < canyons.length; i++)
        {
            drawCanyon(canyons[i]);
            checkCanyon(canyons[i]);
        }
    
    //draw and check collectable item
    for (var i=0; i < collectables.length; i++)
        {
            if(!collectables[i].isFound)
                {
                    drawCollectable(collectables[i]);
                    checkCollectable(collectables[i]); 
                }
        }
    
	//draw game character
    drawGameCharacter();

    //Create flagpole
    renderFlagpole();
    
    //Check players lives - call checkplayerdie function
    checkPlayerDie();
    
    //Draw life tokens onto screen
    drawLifeTokens();
    
    //Game over and Level Complete conditional code
    if (lives <1)
        {
            fill(0);
            textSize(80);
            text('GAME OVER', gameChar_x-200,height/2);
            textSize(20);
            text('Press space to continue.', gameChar_x-100,height/2+40);
        }
    
    if (flagpole.isReached==true)
        {
            fill(0);
            textSize(60);
            text('LEVEL COMPLETE', gameChar_x-270,height/2);
            textSize(20);
            text('Press space to continue.', gameChar_x-100,height/2+40);
        }
    
    pop();
        
    //Draw score at top left
    fill(255);
    noStroke();
    textSize(30);
    text("score: " + game_score, 25, 30);
    
    //Interaction & conditional function to move the game character  
    gameInteraction();
}

function keyPressed()
{
	//if statements to control the animation of the character when keys are pressed
    //Click left or a key
    if(keyCode == 37 || key =="A")
        {
            if (isPlummeting==false)
                {
                    isLeft=true;
                }
        }
    //Click right or s key
    else if (keyCode == 39 || key =="D")
        {
            if (isPlummeting==false)
                {
                    isRight=true;
                }
        }
    
    //Click up or w key
    else if (keyCode == 38 || key =="W")
        {
            if (isFalling==false && isPlummeting==false) 
            {
                gameChar_y-=100;
            }
        }
    else if (keyCode == 32)
        {
            if (lives <1)
                {
                    startGame();
                    lives=3;
                }
            else if (lives >0 && flagpole.isReached==true)
                {
                    startGame();
                    lives=3;
                }  
        }
}
    
function keyReleased()
{
	//if statements to control the animation of the character when keys are released
    //Click Left
    if(keyCode == 37 || key =="A")
        {
            isLeft=false;
        }
    
    //Click Right
    else if (keyCode == 39 || key =="D")
        {
            isRight=false;
        }
}

function drawClouds() 
{
    for (var i=0; i < clouds.length; i++)
        {
            fill(255,255,255);
            ellipse (clouds[i].x_pos-60,clouds[i].y_pos,max(clouds[i].width*0.75,30),max(clouds[i].height*0.75,30));
            ellipse (clouds[i].x_pos-30,clouds[i].y_pos,max(clouds[i].width,40),max(clouds[i].height,40));
            ellipse (clouds[i].x_pos,clouds[i].y_pos,max(clouds[i].width*1.25,50),max(clouds[i].height*1.25,50));
            ellipse (clouds[i].x_pos+30,clouds[i].y_pos,max(clouds[i].width,40),max(clouds[i].height,40));
            ellipse (clouds[i].x_pos+60,clouds[i].y_pos,max(clouds[i].width*0.75,30),max(clouds[i].height*0.75,30));
        }
}

function drawMountains()
{
    for (var i =0; i < mountain.length; i++)
        {
            //left triangle
            fill(0,100,20);
            triangle (mountain[i].x_pos-mountain[i].width,mountain[i].y_pos, mountain[i].x_pos+50,mountain[i].y_pos-102-mountain[i].height, mountain[i].x_pos+100,mountain[i].y_pos);
            //middle triangle
            fill(0,100,20);
            triangle ( mountain[i].x_pos+50,mountain[i].y_pos, mountain[i].x_pos+100,mountain[i].y_pos-152-mountain[i].height, mountain[i].x_pos+150,mountain[i].y_pos);
            //right triangle
            fill(0,100,20);
            triangle ( mountain[i].x_pos+100,mountain[i].y_pos, mountain[i].x_pos+150,mountain[i].y_pos-102-mountain[i].height, mountain[i].x_pos+200+mountain[i].width,mountain[i].y_pos); 
        }
}

function drawTrees()
{
     for (var i=0; i < trees_x.length; i++)
        {
            //draw tree
            fill (120,100,40);
            rect(trees_x[i],treePos_y-5,60,150);
            //branches
            fill(0,155,0);
            triangle(trees_x[i]-50,treePos_y+50,trees_x[i]+30,treePos_y-50, trees_x[i]+110,treePos_y+50)
            triangle(trees_x[i]-50,treePos_y,trees_x[i]+30,treePos_y-100, trees_x[i]+110,treePos_y);
        }
}

function drawCollectable(t_collectable)
{
    if(t_collectable.isFound==false)
        {
            fill(180,100,0);
            stroke(0,0,0);
            strokeWeight(1*t_collectable.size); ellipse(t_collectable.x_pos,t_collectable.y_pos,55*t_collectable.size,30*t_collectable.size);
            ellipse(t_collectable.x_pos,t_collectable.y_pos,50*t_collectable.size,25*t_collectable.size);
            fill(100,50,50);
            textSize(15*t_collectable.size);
            text("$ 2",t_collectable.x_pos-12,t_collectable.y_pos+8);
        }
}

function checkCollectable(t_collectable)
{
      if (dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) <20)
        {
            t_collectable.isFound = true;
            game_score +=1;
        }
}

function drawCanyon(t_canyon)
{
    fill(175,150,100);
    stroke(0,0,0);
    rect(t_canyon.x_pos,floorPos_y,t_canyon.width,144)
    line(t_canyon.x_pos,floorPos_y,t_canyon.x_pos+t_canyon.width,576);   
}

function checkCanyon(t_canyon)
{
    //canyon interaction
    if(gameChar_x>t_canyon.x_pos && gameChar_x<t_canyon.x_pos+t_canyon.width&&gameChar_y>=432)
        {
            console.log("fall in canyon");
            isPlummeting=true;
        }
    //canyon fall down if condition met
    if (isPlummeting==true)
        {
            gameChar_y+=10;
        }
}

function drawGameCharacter()
{
    if(isLeft && isFalling)
	{
        //add your jumping-left code
        //draw head
        fill(200,150,150);
        ellipse(gameChar_x-10,gameChar_y -60,35,35);

        //draw body
        fill(0,150,200);
        rect(gameChar_x-23,gameChar_y-45,26,30);

        //draw hands
        fill(200,150,150);
        rect(gameChar_x-35,gameChar_y-38,20,10);

        //draw feet
        fill(200,100,50);
        rect(gameChar_x-25,gameChar_y-15,10,10);
        rect(gameChar_x-5,gameChar_y-15,10,10);    
	}
    
	else if(isRight && isFalling)
	{
        //add your jumping-right code
        //draw head
        fill(200,150,150);
        ellipse(gameChar_x+10,gameChar_y -60,35,35);

        //draw body
        fill(0,150,200);
        rect(gameChar_x-3,gameChar_y-45,26,30);

        //draw hands
         fill(200,150,150);
        rect(gameChar_x+15,gameChar_y-38,20,10);

        //draw feet
        fill(200,100,50);
        rect(gameChar_x-5,gameChar_y-15,10,10);
        rect(gameChar_x+15,gameChar_y-15,10,10);    
        }
    
	else if(isLeft)
        {
        //add your walking left code
        //draw head
        fill(200,150,150);
        ellipse(gameChar_x-10,gameChar_y -50,35,35);

        //draw body
        fill(0,150,200);
        rect(gameChar_x-23,gameChar_y-35,26,30);

        //draw hands
         fill(200,150,150);
        rect(gameChar_x-35,gameChar_y-30,20,10);

        //draw feet
        fill(200,100,50);
        rect(gameChar_x-25,gameChar_y-5,10,10);
        rect(gameChar_x-5,gameChar_y-5,10,10);
	}
    
	else if(isRight)
        {
        //add your walking right code
        //draw head
        fill(200,150,150);
        ellipse(gameChar_x+10,gameChar_y -50,35,35);

        //draw body
        fill(0,150,200);
        rect(gameChar_x-3,gameChar_y-35,26,30);

        //draw hands
        fill(200,150,150);
        rect(gameChar_x+15,gameChar_y-30,20,10);

        //draw feet
        fill(200,100,50);
        rect(gameChar_x-5,gameChar_y-5,10,10);
        rect(gameChar_x+15,gameChar_y-5,10,10);
        }
    
	else if(isFalling || isPlummeting)
        {
        //add your jumping facing forwards code
        //draw head
        fill(200,150,150);
        ellipse(gameChar_x,gameChar_y -60,35,35);

        //draw body
        fill(0,150,200);
        rect(gameChar_x-13,gameChar_y-45,26,30);

        //draw hands
        fill(200,150,150);
        rect(gameChar_x+13,gameChar_y-40,20,10);
        rect(gameChar_x-33,gameChar_y-40,20,10);

        //draw feet
        fill(200,100,50);
        rect(gameChar_x-15,gameChar_y-15,10,10);
        rect(gameChar_x+5,gameChar_y-15,10,10);
        }
    
	else
        {
        //add your standing front facing code
        //draw head
        fill(200,150,150);
        ellipse(gameChar_x,gameChar_y -50,35,35);

        //draw body
        fill(0,150,200);
        rect(gameChar_x-13,gameChar_y-35,26,30);

        //draw hands
        fill(200,150,150);
        rect(gameChar_x-20,gameChar_y-32,10,20);
        rect(gameChar_x+10,gameChar_y-32,10,20);

        //draw feet
        fill(200,100,50);
        rect(gameChar_x-15,gameChar_y-5,10,10);
        rect(gameChar_x+5,gameChar_y-5,10,10);
        }
}

function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y -250);
    fill(255,0,255);
    noStroke();
    
    if(flagpole.isReached)
        {
            rect(flagpole.x_pos,floorPos_y-250,50,50);   
        }
    else 
        {
            rect(flagpole.x_pos,floorPos_y-50,50,50);   
        }
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_x - flagpole.x_pos);
    if (d<15)
        {
            flagpole.isReached = true;
        }
}

function checkPlayerDie()
{
    if (gameChar_y > height) 
        {
            lives -=1;
            if (lives>0)
                {
                    startGame();
                }
        }
}

function drawLifeTokens()
{
    if (lives ==3)
        {
            fill(255,255,0);
            ellipse(gameChar_x+400,50,50);
            ellipse(gameChar_x+350,50,50);
            ellipse(gameChar_x+300,50,50);
        }
    
    else if (lives ==2)
        {
            fill(255,255,0);
            ellipse(gameChar_x+350,50,50);
            ellipse(gameChar_x+300,50,50);
        }
    else if (lives ==1)
        {
            fill(255,255,0);
            ellipse(gameChar_x+300,50,50);
        }
}

function gameInteraction()
{
    if(isLeft==true)
        {
            gameChar_x -= 5;
        }
    
    if(isRight==true)
        {
            gameChar_x +=5;
        }

    //create gravity
    if (gameChar_y<floorPos_y) 
        {
            gameChar_y +=3;
            isFalling=true;        
        }
    else 
        {
            isFalling=false;
        }
    
    if(flagpole.isReached == false)
        {
            checkFlagpole();
        }
}

function startGame()
{
    //initialize variables
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
    treePos_y = height/2;
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    
    //initialize array of collectable objects
    collectables =[
        {
            x_pos:-700,
            y_pos:floorPos_y,
            size:1,
            isFound:false
        },
        {
            x_pos:100,
            y_pos:floorPos_y,
            size:1,
            isFound:false
        },
        {
            x_pos:1000,
            y_pos:floorPos_y,
            size:1,
            isFound:false
        },
        {
            x_pos:1600,
            y_pos:floorPos_y,
            size:1,
            isFound:false
        }
    ]
    
    
    //initialize array of canyon objects
    canyons =[
        {
            x_pos:300,
            width:50
        },
        {
            x_pos:800,
            width:100
        },
        {
            x_pos:1400,
            width:100
        },
        {
            x_pos:-300,
            width:100
        },
        {
            x_pos:-300,
            width:150
        },
        {
            x_pos:2200,
            width:150
        }
    ]
    
    //initialize trees variable with array of x positions
    trees_x = [-800, -500, -250, 300,500,900,1150, 1400, 1800, 2250, 2500, 2800, 3000];

    //initialize clouds variable with array of objects
    clouds = [
        {x_pos: -800, y_pos:100, width:60, height:60},
        {x_pos: -500, y_pos:100, width:60, height:60},
        {x_pos: -300, y_pos:100, width:60, height:60},
        {x_pos: 100, y_pos:100, width:60, height:60},
        {x_pos: 400, y_pos:120, width:60, height:60},
        {x_pos: 700, y_pos:100, width:60, height:60},
        {x_pos: 1000, y_pos:120, width:60, height:60},
        {x_pos: 1300,y_pos:100, width:60, height:60},
        {x_pos: 1600, y_pos:120, width:60, height:60},
        {x_pos: 1900, y_pos:100, width:60, height:60},
    ];
    
    //initialize mountain variable with array of objects
    mountain = [
        {x_pos: -800, y_pos:432, width:50, height:100},
        {x_pos: -400, y_pos:432, width:50, height:100},
        {x_pos: 50, y_pos:432, width:50, height:100},
        {x_pos: 400, y_pos:432, width:50, height:200},
        {x_pos: 750, y_pos:432, width:50, height:150},
        {x_pos: 1000, y_pos:432, width:50, height:150},
        {x_pos: 1350, y_pos:432, width:50, height:150},
        {x_pos: 1750, y_pos:432, width:50, height:250},
    ];
    //initialize cameraPosX variable as zero
    cameraPosX =0;
    
    //set game score to zero at start
    game_score = 0;
    
    //initialize flagpole
    flagpole = {isReached: false, x_pos:2000};
}