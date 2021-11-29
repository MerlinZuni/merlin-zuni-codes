let font1;
let img;
let imgs = [];
let pg;
let slider;
let firstCopyW, firstCopyH;
let angle1 = 0;
let scalar = 20;

function preload() {
  font1 = loadFont('AbrilFatface-Regular.ttf');
}

function setup() {
  let canvas= createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-container");
	
	
	slider = createSlider(3, 20, 10);
    slider.position(10, 10);
    slider.style('width', '60px');
	
	img = createGraphics(windowWidth,windowHeight);
	img.background(255);
	img.fill(0);
	img.textFont(font1);
	img.textSize(600);
	img.translate(width / 2, height / 2);
	img.textAlign(CENTER, CENTER);
}

function draw() {
	background(0);
	
	firstCopyW = windowWidth/slider.value();
	firstCopyH = windowHeight/slider.value();
	
	let ang1 = radians(angle1);
    let x1 = scalar * cos(ang1);
	
	img.background(251, 247, 245);
	push();
	img.translate(x1, 0);
	pop();
    
	img.text("Merlin", 0, 0);
	
	 for(let i = slider.value(); i > 1; i--){
		imageMode(CENTER);
    push();
    translate(width / 2, height / 2);
        fill(197, 203, 211);
		image(img, 0, 0, firstCopyW*i, firstCopyH*i);
		pop();
	} 

	angle1 += 2;
}











