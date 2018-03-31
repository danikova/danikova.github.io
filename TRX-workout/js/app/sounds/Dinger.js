var ding1 = new Audio('./js/app/sounds/ding.mp3');
var ding2 = new Audio('./js/app/sounds/ding.mp3');

function singleDing(){
    ding1.play();
}

function doubleDing(){
    singleDing();
    setTimeout(()=>{
        ding2.play();
    }, 400);
}