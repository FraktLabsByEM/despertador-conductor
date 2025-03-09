import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver } = vision;
// REFERENCES TO ELEMENTS

// Ref to header
const $navbar = document.querySelector("header");
// Ref to live video
const $video = document.querySelector("#live-video");
// Ref to button (toggle face monitoring)
const $button = document.querySelector(".btn-flotante");
// Ref to alert sound
const $alert = document.querySelector("#alert");

// Load mediapipe task
let filesetResolver;
// Facepoint detection model
let faceLandmarker;

// Select and load live camera stream
const loadVideoSrc = ()=> {
    // Retrieve media video
    navigator.mediaDevices.getUserMedia({
            // use facing mode "user" for front camera in mobile phones
            video: { facingMode: "user", width: 1280, height: 720 }
        })
        // Retrieve camera video stream
        .then(async stream => {
            // Stream camera to video element
            $video.srcObject = stream;
            $video.play();
            // Load model wasm file
            filesetResolver = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );
            // Configure model
            faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                    delegate: "GPU"
                },
                outputFaceBlendshapes: true,
                runningMode: "IMAGE",
                numFaces: 1
            });
        })
}

// Loop id used to stop inference loop
let loopId;
/**
 * Request face prediction
 */
const predict = async () => {
    if(faceLandmarker == undefined) return;
    // Retrieve last frame
    const frame = getFrame();
    // Request inference
    const result = await faceLandmarker.detect(frame);
    console.log(result)
    // Validate and process results
    if(result.faceBlendshapes[0]) inferEyes(result.faceBlendshapes[0].categories);
    // Recall loop function
    loopId = requestAnimationFrame(predict);
}

// Last time stamp where user was detected with open eyes
let lastOpenEyesTime = 0;
// User eyes are currently closed
let closedEyesDetected = false;
// Strike counts (how many times the user have been detected sleeping)
let strikes = 0;

/**
 * Determine if the user eyes are closed
 * @param {*} categories result of mediapipe faceBlendshapes.categories
 */
const inferEyes = (categories) => {
    // left eye
    const leftEye = categories[9].score;
    // right eye
    const rightEye = categories[10].score;
    // Evaluate if both user eyes are blink
    if(leftEye > 0.3 && rightEye > 0.3){
        // If already alerted return
        if(closedEyesDetected) return;
        // Validate user blinking for more than 300 ms
        if(timestamp() - lastOpenEyesTime > 300){
            // update status "closed eyes detected"
            closedEyesDetected = true;
            // navbar in alert mode (red bg)
            $navbar.classList.add("alert");
            // body in alert mode (red-blue blinking)
            document.body.classList.add("alert");
            // play alert sound
            $alert.play();
            // increase strikes
            strikes++;
            // If strikes more than 3 maximum alert
            if(strikes > 2) alertUser();
        }
    } else {
        closedEyesDetected = false; // reset closed eyes
        lastOpenEyesTime = timestamp(); // update last user open eyes time
        $navbar.classList.remove("alert"); // remove header alert mode
        document.body.classList.remove("alert"); // remove body alert mode
        // Try to stop audio
        try{
            $alert.pause();
            $alert.currentTime = 0;
        } catch(err){
            console.log(err);
        }
    }
}

/**
 * Get current time stamp
 * @returns current time stamp
 */
const timestamp = () => new Date().getTime();

/**
 * Use speech synthesis to provide an alert to user suggesting to stop the car and sleep
 */
const alertUser = ()=>{
    // Create message utterance
    const utt = new SpeechSynthesisUtterance("Por favor, deténgase y descanse. No ponga en riesgo su vida y la de los demás.");
    utt.lang = "es"; // lang spanish (es)
    utt.rate = 0.9; // Slow the speech rate
    speechSynthesis.speak(utt); // Play speech alert
}

/**
 * Get current camera livestream frame
 * @returns canvas element with current frame
 */
const getFrame = () => {
    // Create temporary canvas and context
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    // Get dom element dimensions
    const size =  { w: $video.offsetWidth, h: $video.offsetHeight };
    // Get source dimensions
    const srcSize =  { w: $video.videoWidth, h: $video.videoHeight };
    // Determine camera orientation (may be vertical in mobile phone)
    const vertical = srcSize.h > srcSize.w;
    // Update canvas width to match livestream size
    canvas.width = size.w;
    canvas.height = size.w;
    // determine horizontal and vertical offset based on source orientation
    const offsetX = vertical ? 0: (srcSize.w - srcSize.h) / 2;
    const offsetY = vertical ? (srcSize.h - srcSize.w) / 2: 0;
    // Square dimension (source)
    const dim = vertical ? srcSize.w: srcSize.h;
    // Draw frame in canvas
    ctx.drawImage($video, offsetX, offsetY, dim, dim,  0, 0, size.w, size.h);
    return canvas;
}

// Status of detection
let isDetectionActive = false;

// Add button toggle listener
$button.addEventListener("click", e => {
    if(!isDetectionActive){
        // change button text and appearance
        $button.textContent = "Desactivar Monitoreo";
        $button.classList.add("active");
        // Update detection status
        isDetectionActive = true;
        predict();
    } else {
        // change button text and appearance
        $button.textContent = "Activar Monitoreo";
        $button.classList.remove("active");
        // Update detection status
        isDetectionActive = false;
        // Break loop
        if(loopId != undefined) cancelAnimationFrame(loopId);
    }
})

// When document is loaded, load videosource
document.addEventListener("DOMContentLoaded", loadVideoSrc);