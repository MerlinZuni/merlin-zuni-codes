// rotation clock setup
function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent("clock-container");
  centerX = width/2
  centerY = height/2
  radius = 100
}

function draw() {
  background(225, 225, 225, 4); // Off white
  noFill();

  // Clock path shapes
  //fill(235, 235, 235);
  noFill();
  stroke(197, 203, 211); // silver sand
  strokeWeight(8)
  circle(width/2, height/2, width/1.5)
  
  // Red inner circle
  stroke(187, 52, 47); // Golden Gate
  strokeWeight(4);
  circle(width/2, height/2, 200);
  
  
  // Blue inner circle
  stroke(140, 188, 185) // opal blue
  noFill();
  strokeWeight(3)
  circle(    
    centerX + radius * sin(millis()/-43200000),
    centerY + radius * cos(millis()/-43200000),
    100
  )
  
  // Yellow inner circle
  stroke(221, 164, 72); //indian yellow
  noFill();
  strokeWeight(1)
  circle(    
    centerX + radius * sin(millis()/-3600000) + radius/2 * sin(millis()/-60000),
    centerY + radius * cos(millis()/-3600000) + radius/2 * cos(millis()/-60000),
    50
  )
  
  // black point center of Clock
  fill(197, 203, 211) // silver sand
  stroke(197, 203, 211) // silver sand
  strokeWeight(10)
  point(centerX, centerY)
  
  
  // Clock hand - part 1, 12 Hours
  stroke(197, 203, 211) // silver sand
  strokeWeight(2)
  line(
    centerX,
    centerY,
    centerX + radius * sin(millis()/-43200000),
    centerY + radius * cos(millis()/-43200000)
  )  

  // red point rotating around black point
  strokeWeight(10)
  stroke(187, 52, 47) // Golden Gate
  point(
      centerX + radius * sin(millis()/-43200000),
      centerY + radius * cos(millis()/-43200000)
  )

  // Clock hand - part 2, 60 Minutes
  //stroke(255,0,0)
  strokeWeight(1)
  line(
    centerX + radius * sin(millis()/-43200000),
    centerY + radius * cos(millis()/-43200000),
    centerX + radius * sin(millis()/-3600000) + radius/2 * sin(millis()/-60000),
    centerY + radius * cos(millis()/-3600000) + radius/2 * cos(millis()/-60000)
      )  
  
  // blue point rotating around red point
  strokeWeight(10)
  stroke(140, 188, 185) // opal blue
  point(
      minuteX = centerX + radius * sin(millis()/-3600000) + radius/2 * sin(millis()/-60000),
      minuteY = centerY + radius * cos(millis()/-3600000) + radius/2 * cos(millis()/-60000)
  ) 

  // Clock hand - part 3, 60 Seconds
  //stroke(255,0,0)
  strokeWeight(1)
  line(
      centerX + radius * sin(millis()/-3600000) + radius/2 * sin(millis()/-60000),
      minuteY = centerY + radius * cos(millis()/-3600000) + radius/2 * cos(millis()/-60000),
      centerX + radius * sin(millis()/-3600000) + radius/2 * sin(millis()/-60000) + radius/4 * sin(millis()/-1000),
      centerY + radius * cos(millis()/-3600000) + radius/2 * cos(millis()/-60000) + radius/4 * cos(millis()/-1000)
      )  
  
    
  // yellow point rotating around red point
  strokeWeight(10)
  stroke(221, 164, 72) // indian yellow
  point(
      centerX + radius * sin(millis()/-3600000) + radius/2 * sin(millis()/-60000) + radius/4 * sin(millis()/-1000),
      centerY + radius * cos(millis()/-3600000) + radius/2 * cos(millis()/-60000) + radius/4 * cos(millis()/-1000)
  )
}