import clock from "clock";
import document from "document";

import { today } from "user-activity";
import { HeartRateSensor } from "heart-rate";

import * as util from "../common/utils.js";

// Update the clock every second
clock.granularity = "seconds";

let background = document.getElementById("background");
let hours = document.getElementsByClassName("hours");

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");
let date = document.getElementById("date");
let day_box = document.getElementsByClassName("day_box");

let center_text = document.getElementById("center_text");
let center_image = document.getElementById("center_image");

let animationSecHand = document.getElementById("animationSecHand");
let animationHourHand = document.getElementById("animationHourHand");
let animationMinHand = document.getElementById("animationMinHand");

var correction = 3;

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle + correction;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes + correction;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds, milli) {
  var total_seconds = (360 / 60) * seconds;
  var total_millis = (360 / 60 / 1000) * milli;
  
  var total = total_seconds+total_millis;
  
  if( total > 360){
    total = 360;
  }
  
  return total;
}

// Rotate the hands every tick
function updateClock() {
  let today = new Date();
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
  let secs = today.getSeconds();
  let milli = today.getMilliseconds();

  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs,milli);
  
  date.text = util.zeroPad(today.getDate());
  
  requestAnimationFrame(updateClock);
}
requestAnimationFrame(updateClock);

//Scenechanger

var current_step = 0;

changeScene();

background.onclick = function(e) {
  forward();
}

hours.forEach(function(element) {
  element.onclick = function(e) {
    forward();
  }
});

center_image.onclick = function(e) {
  forward();
}
center_text.onclick = function(e) {
  forward();
}

hourHand.onclick = function(e) {
  forward();
}
minHand.onclick = function(e) {
  forward();
}
secHand.onclick = function(e) {
  forward();
}

function forward(){
  current_step++;
  console.log("current_step: "+current_step);
  
  changeScene();
}

var timeout;
function changeScene(){
  clearTimeout(timeout);
  
  //Step Main - Analog Clock
  if(current_step == 0){    
    hourHand.style.display = "inline";
    minHand.style.display = "inline";
    secHand.style.display = "inline";
    date.style.display = "inline";
    day_box[0].style.display = "inline";
    day_box[1].style.display = "inline";
    
    center_text.style.display = "none";
    center_image.style.display = "none";
  }else{
    date.style.display = "none";
    day_box[0].style.display = "none";
    day_box[1].style.display = "none";
  }
  
  //Step 1 - Steps
  
  if(current_step == 1){
    animationSecHand.animate("enable");
    animationHourHand.animate("enable");
    animationMinHand.animate("enable");
    
    setTimeout(function(){
      hourHand.style.display = "none";
      minHand.style.display = "none";
      secHand.style.display = "none";
    }, 299);
    
    center_text.style.display = "inline";
    center_image.style.display = "inline";
    center_text.text = (today.local.steps || 0);
    center_image.href = "steps.png";
    center_image.height = 50;
    center_image.width = 50;
  }
  
  //Step 2 - Heart Rate
  var hrm = new HeartRateSensor();
  if(current_step == 2){
    center_image.href = "heartbeat.png";
    center_image.height = 44.5;
    
    center_text.text = "...";
    hrm.onreading = function() {
      center_text.text = hrm.heartRate;
    };
    hrm.start();
  }else{
    hrm.stop();
  }
  
  //Step 3 - Calories
  if(current_step == 3){
    center_text.text = (today.local.calories || 0);
    center_image.href = "calories.png";
    center_image.height = 50;
    center_image.width = 50;
  }
  
  //Step 4 - Floors
  if(current_step == 4){
    center_text.text = (today.local.elevationGain || 0);
    center_image.href = "floors.png";
    center_image.height = 50;
    center_image.width = 50;
  }
  
  
  //Back to step main
  if(current_step == 4){
    current_step = -1;
  }
  
  timeout = setTimeout(function(){
    current_step = 0;
    changeScene();
  }, 10000);
}