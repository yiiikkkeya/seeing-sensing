let video;
let prevImg;
let diffImg;
let currImg;
let thresholdSlider;
let threshold;
let grid;
///////////////////////////////////////////////////////////
function setup() {
    createCanvas(640 * 2, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();

    thresholdSlider = createSlider(0, 255, 50);
    thresholdSlider.position(20, 20);

    grid = new Grid(640,480);
}
///////////////////////////////////////////////////////////
function draw() {
    background(0);
    image(video, 0, 0);

    currImg = createImage(video.width, video.height);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
    currImg.resize(video.width/4, video.height/4);
    currImg.filter("blur", 3);

    diffImg = createImage(video.width, video.height);
    diffImg.resize(video.width/4, video.height/4);
    diffImg.loadPixels();

    threshold = thresholdSlider.value();

    if (typeof prevImg !== 'undefined') {
        prevImg.loadPixels();
        currImg.loadPixels();
        for (let x = 0; x < currImg.width; x += 1) {
            for (let y = 0; y < currImg.height; y += 1) {
                let index = (x + (y * currImg.width)) * 4;
                let redSource = currImg.pixels[index + 0];
                let greenSource = currImg.pixels[index + 1];
                let blueSource = currImg.pixels[index + 2];

                let redBack = prevImg.pixels[index + 0];
                let greenBack = prevImg.pixels[index + 1];
                let blueBack = prevImg.pixels[index + 2];

                let d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);

                if (d > threshold) {
                    diffImg.pixels[index + 0] = 0;
                    diffImg.pixels[index + 1] = 0;
                    diffImg.pixels[index + 2] = 0;
                    diffImg.pixels[index + 3] = 255;
                } else {
                    diffImg.pixels[index + 0] = 255;
                    diffImg.pixels[index + 1] = 255;
                    diffImg.pixels[index + 2] = 255;
                    diffImg.pixels[index + 3] = 255;
                }
            }
        }
    }
    diffImg.updatePixels();
    image(diffImg, 640, 0);

    noFill();
    stroke(255);
    text(threshold, 160, 35);

    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);

    grid.run(diffImg);
}
