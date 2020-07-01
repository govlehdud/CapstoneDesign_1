let webcam, model_w;
const btnCamera = document.querySelector(".camera-btn");

// Load the image model and setup the webcam
async function webcaminit() {
    $('.image-upload-wrap').hide();

    modelURL = URL + "model.json";
    metadataURL = URL+ "metadata.json";

    model_w = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model_w.getTotalClasses();
    
    // // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();

    w_predict();
    window.requestAnimationFrame(w_loop);
   
    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    for (let i = 0; i < maxPredictions; i++) { // and class labels
        const div = document.createElement("div");
        div.id = "d-flex"+i;
        labelContainer.appendChild(div);
    }

    $('.camera-btn').hide();
    $('.file-upload-content').show();
    $('.file-upload-image').hide();
    $('.start-image').hide();
}

async function w_loop() {
    webcam.update(); // update the webcam frame
    w_predict();
    window.requestAnimationFrame(w_loop);
}

// run the webcam image through the image model
async function w_predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model_w.predict(webcam.canvas);
    
    percentBar(prediction, maxPredictions);
}

btnCamera.addEventListener("click", webcaminit);