let contraints = [{ video: true }];
let videoPlayer = document.querySelector("video");
let videoRecorderBtn = document.querySelector("#video-record");
let captureImg = document.querySelector("#click-picture");

let mediaRecorder;

let chunks = [];
let time = 1;

let upArrowBlock = false;
let downArrowBlock = true;

function myTimer(){
    const countEle = document.getElementById("timer");
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if(Math.floor(seconds / 10) == 0){
        countEle.innerHTML = `${minutes}:0${seconds}`;
    }else{
        countEle.innerHTML = `${minutes}:${seconds}`;
    }
    
    time++;
}

let timer = document.createElement("div");
timer.setAttribute('id', 'timer');
timer.innerHTML = `0:00`;

videoRecorderBtn.addEventListener("click", function (e) {
    mediaRecorder.start();  
    let rv = setInterval(myTimer, 1000);
    
    document.querySelector(".video-container").appendChild(timer);

    document.querySelector("#click-picture").remove();
    document.querySelector("#video-record").remove();

    let pauseButton = document.createElement("span");
    pauseButton.classList.add("material-icons");
    pauseButton.classList.add("selected-icon");
    pauseButton.innerText = "pause";
    pauseButton.setAttribute('id', 'pause-video');
    document.querySelector(".menu-items").appendChild(pauseButton);

    let stopButton = document.createElement("span");
    stopButton.classList.add("material-icons");
    stopButton.classList.add("selected-icon");
    stopButton.innerText = "stop";
    stopButton.setAttribute('id', 'stop-video');
    document.querySelector(".menu-items").appendChild(stopButton);

    document.querySelector("#stop-video").addEventListener("click", function () {
        mediaRecorder.stop();

        time = 1;
        document.querySelector("#timer").innerHTML = `0:00`;
        clearInterval(rv);

        document.querySelector(".video-container").removeChild(timer);
        
        document.querySelector("#stop-video").remove();
        document.querySelector("#pause-video").remove();

        document.querySelector(".menu-items").appendChild(videoRecorderBtn);
        document.querySelector(".menu-items").appendChild(captureImg);
    });

    let videoPaused = false;
    document.querySelector("#pause-video").addEventListener("click", function () {
        if (!videoPaused) {
            clearInterval(rv);

            videoPaused = true;
            pauseButton.innerText = "play_arrow";
            mediaRecorder.pause();
        } else {
            rv = setInterval(myTimer, 1000);

            videoPaused = false;
            pauseButton.innerText = "pause";
            mediaRecorder.resume();
        }
    });
});



navigator.mediaDevices.getUserMedia({ video: true }).then(function (mediaStream) {
    videoPlayer.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
    }

    mediaRecorder.onstop = function () {
        let blob = new Blob(chunks, { type: "video/mp4" });
        chunks = [];
        let blobURL = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = blobURL;
        a.download = "temp.mp4";
        a.click();
    }
});

captureImg.addEventListener("click", function () {
    let canvas = document.createElement("canvas");
    canvas.height = videoPlayer.videoHeight;
    canvas.width = videoPlayer.videoWidth;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(videoPlayer, 0, 0);
    if (filter != "") {
        ctx.fillStyle = filter;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    let link = document.createElement("a");
    link.download = "img.png";
    link.href = canvas.toDataURL();
    link.click();
});

let upArrow = document.querySelector("#keyboard-arrow-up");
let downArrow = document.querySelector("#keyboard-arrow-down");

upArrow.addEventListener("click", function(){
    if(!upArrowBlock){
        document.querySelector(".video-container").appendChild(timer);

        document.querySelector("#click-picture").classList.remove("selected-icon");
        document.querySelector("#video-record").classList.add("selected-icon");
        upArrowBlock = true;
        downArrowBlock = false;
    }
    
});
downArrow.addEventListener("click", function(){
    if(!downArrowBlock){
        document.querySelector(".video-container").removeChild(timer);

        document.querySelector("#click-picture").classList.add("selected-icon");
        document.querySelector("#video-record").classList.remove("selected-icon");
        downArrowBlock = true;
        upArrowBlock = false;
    }
    
});

document.querySelector("#timer-choices").addEventListener("click", function(){
    console.log("hello");
    document.querySelector(".dropdown-content").classList.add(".show");
});

let filter;
let allFilters = document.querySelectorAll(".filter");
for (let i of allFilters) {
    i.addEventListener("click", function (e) {
        filter = e.currentTarget.style.backgroundColor;
        addFilterToScreen(filter);
    });
}
function addFilterToScreen(Filter) {
    let prevFilter = document.querySelector(".screen-filter");
    if (prevFilter) {
        prevFilter.remove();
    }
    let filterScreen = document.createElement("div");
    filterScreen.classList.add("screen-filter");
    filterScreen.style.height = videoPlayer.offsetHeight + "px";
    filterScreen.style.width = videoPlayer.offsetWidth + "px";
    filterScreen.style.backgroundColor = Filter;
    document.querySelector(".filter-screen-parent").append(filterScreen);
}