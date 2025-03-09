import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver } = vision;

const $navbar = document.querySelector("header");
const $video = document.querySelector("#live-video");
const $button = document.querySelector(".btn-flotante");
const $alert = document.querySelector("#alert");

let filesetResolver;
let faceLandmarker;


const loadVideoSrc = ()=> {
    navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: 1280, height: 720 }
        })
        .then(async stream => {
            $video.srcObject = stream;
            $video.play();
            filesetResolver = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );
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


let loopId;
const predict = async () => {
    if(faceLandmarker == undefined) return;
    // Obtener el ultimo frame
    const frame = getFrame();
    // Inferir y evaluar ojos cerrados
    const result = await faceLandmarker.detect(frame);
    if(result.faceBlendshapes[0]) inferEyes(result.faceBlendshapes[0].categories);
    // Llamar nuevamente al loop
    loopId = requestAnimationFrame(predict);
}

let lastOpenEyesTime = 0;
let openEyesDetected = false;
let strikes = 0;

const inferEyes = (categories) => {
    const leftEye = categories[9].score;
    const rightEye = categories[10].score;
    console.log(leftEye, rightEye)
    if(leftEye > 0.3 && rightEye > 0.3){
        if(openEyesDetected) return;
        if(timestamp() - lastOpenEyesTime > 300){
            openEyesDetected = true;
            $navbar.classList.add("alert");
            document.body.classList.add("alert");
            $alert.play();
            strikes++;
            if(strikes > 2) alertUser();
        }
    } else {
        openEyesDetected = false;
        lastOpenEyesTime = timestamp();
        $navbar.classList.remove("alert");
        document.body.classList.remove("alert");
        try{
            $alert.pause();
            $alert.currentTime = 0;
        } catch(err){
            console.log(err);
        }
    }
}


const timestamp = () => new Date().getTime();

const alertUser = ()=>{
    strikes = 0;
    const utt = new SpeechSynthesisUtterance("Por favor, deténgase y descanse. No ponga en riesgo su vida y la de los demás.");
    utt.lang = "es";
    utt.rate = 0.9;
    speechSynthesis.speak(utt);
}

const getFrame = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size =  { w: $video.offsetWidth, h: $video.offsetHeight };
    const srcSize =  { w: $video.videoWidth, h: $video.videoHeight };
    const vertical = srcSize.h > srcSize.w;
    canvas.width = size.w;
    canvas.height = size.w;
    const offsetX = vertical ? 0: (srcSize.w - srcSize.h) / 2;
    const offsetY = vertical ? (srcSize.h - srcSize.w) / 2: 0;
    const dim = vertical ? srcSize.w: srcSize.h;
    console.log(srcSize, vertical, offsetX, offsetY, dim)
    ctx.drawImage($video, offsetX, offsetY, dim, dim,  0, 0, size.w, size.h);
    return canvas;
}

let isDetectionActive = false;

$button.addEventListener("click", e => {
    if(!isDetectionActive){
        $button.textContent = "Desactivar Monitoreo";
        $button.classList.add("active");
        isDetectionActive = true;
        predict();
    } else {
        $button.textContent = "Activar Monitoreo";
        $button.classList.remove("active");
        isDetectionActive = false;
        if(loopId != undefined) cancelAnimationFrame(loopId);
    }
})

document.addEventListener("DOMContentLoaded", loadVideoSrc);