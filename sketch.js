/* The Project is in the working stage so it has a lot of bugs and the height button is not working
right now so it is showing error in the measurement of bofy parts
as i am working on this project and will fix this bug by this month end.
i have attached a pic of mine as a test you can see it by uploading the pic and then use the inspect command in the site and their you will find all the 
details.*/
let img;
let poseNet;
let poses = [];
let input;

function setup() {
    createCanvas(600,940);
    var height= document.getElementById("height").value
    submit = select('#submit');
  //browse button input and position
    input = createFileInput(handleFile);
    input.position(300,300);

    // create an image using the p5 dom library
    // call modelReady() when it is loaded
    //img = createImg('https://photos.app.goo.gl/TfQL74MLSXDsDVP69', imageReady);
    // set the image size to the size of the canvas
    //img.size(width, height);

    //img.hide(); // hide the image in the browser
    frameRate(1); // set the frameRate to 1 since we don't need it to be running quickly in this case
}

function handleFile(file) {
    print(file);
    if(file.type == 'image'){
        img = createImg(file.data, imageReady);
        img.size(600, 940);
        img.hide();
    }else {
        img = null;
    }
}

// when the image is ready, then load up poseNet
function imageReady(){
    // set some options
    let options = {
        imageScaleFactor: 1,
        minConfidence: 0.1
    
    }
    
    // assign poseNet
    poseNet = ml5.poseNet(modelReady, options);
    // This sets up an event that listens to 'pose' events
    poseNet.on('pose', function (results) {
        poses = results;
    });
  
}

// when poseNet is ready, do the detection
function modelReady() {
    select('#status').html('Model Loaded');
     
    // When the model is ready, run the singlePose() function...
    // If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results 
    // in the draw() loop, if there are any poses, then carry out the draw commands
    poseNet.singlePose(img)
}

// draw() will not show anything until poses are found
function draw() {
    if (poses.length > 0) {
        image(img, 0, 0, width, height);
        drawSkeleton(poses);
        drawKeypoints(poses);
        noLoop(); 
        getCoordinates();
      imgRes();
      
      // stop looping when the poses are estimated
    }

}

// The following comes from https://ml5js.org/docs/posenet-webcam
// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
     
         
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.8) {
                fill(0,255,0);
                stroke(20);
                strokeWeight(1);
                ellipse(round(keypoint.position.x), round(keypoint.position.y), 8, 8);
              
              console.log(poses)
            
            }
        }
    }
}


//A function to get the coordinates
function getCoordinates(){
//loop through 
  var x1= [];
  var x2=[];
  var y1=[];
  var y2=[];
  var part1=[];
  var part2=[];
  for( i=0; i<poses[0].skeleton.length; i++){
    x1.push(poses[0].skeleton[i][0].position.x)
    x2.push(poses[0].skeleton[i][1].position.x)
    y1.push(poses[0].skeleton[i][0].position.y)
    y2.push(poses[0].skeleton[i][1].position.y)
    part1.push(poses[0].skeleton[i][0].part)
    part2.push(poses[0].skeleton[i][1].part)
          
}

  //a function to get height
  {
    a=distance(x1[2],x2[2],y1[2],y2[2])
  b=distance(x1[1],x2[1],y1[1],y2[1])
  c=distance(x1[10],x2[10],y1[10],y2[10])
  d=distance(x1[6],x2[6],y1[6],y2[6])
  e=distance(x1[7],x2[7],y1[7],y2[7])
    Height= +a + +b + +c + +d + +e;
  console.log('Height='+Height);
  }
  
  //function to get a scale
  //here 185 is height in cms
  {scale= height/Height * 0.393;
   console.log(scale)
  }
  
  //A function get the distance
  function distance(a,b,c,d){
    var dis =  Math.sqrt(Math.pow((a-b),2) +Math.pow((c-d),2))
      
  return dis.toFixed(2);
  
        }
  
  {var dist =[]
  for(i=0; i<x1.length;i++){
  var  di= distance(x1[i],x2[i],y1[i],y2[i])*scale;
    
    
     console.log("distance between "+part1[i]+" and "+part2[i]+"="+ di.toFixed(1)+" inches")
}
   
}
}

//A function get the image res
function imgRes(){
  
  var width= img.clientWidth;
  var height=img.clientHeight;
  console.log("The image resolution is "+width+"x"+height);
}

// A function to draw the skeletons
function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;
        // For every skeleton, loop through all body connections
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255);
            strokeWeight(1);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
          
 
        }
    }
}