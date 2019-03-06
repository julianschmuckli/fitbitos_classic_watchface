import clock from "clock";
import document from "document";
import * as messaging from "messaging";
import * as fs from "fs";

import { vibration } from "haptics";
import { display } from "display";

import { today } from "user-activity";
import { HeartRateSensor } from "heart-rate";

import { battery, charger } from "power";

import * as util from "../common/utils.js";

let background = document.getElementById("background");
let hours = document.getElementsByClassName("hours");

let secHandElements = document.getElementsByClassName("secondHand");

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");
let date = document.getElementById("date");
let day_box = document.getElementsByClassName("day_box");

let center_text = document.getElementById("center_text");
let center_image = document.getElementById("center_image");
let bottom_clock = document.getElementById("bottom_clock");

let animationSecHand = document.getElementById("animationSecHand");
let animationHourHand = document.getElementById("animationHourHand");
let animationMinHand = document.getElementById("animationMinHand");

let meta_battery = document.getElementById("battery");

var correction = 3;

var alwaysOn, alwaysOnPaused = false;

var batteryCorner = false;

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

  if(total > 360){
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

  if(alwaysOn != "true"){
    requestAnimationFrame(updateClock);
  }else{
    if(today.getHours() > 21 || today.getHours() < 6){
      display.autoOff = true;
      alwaysOnPaused = true;
    }else{
      alwaysOnPaused = false;
      display.autoOff = false;
    }
  }

  //Meta-Information
  if(batteryCorner=="true"){
    meta_battery.text = Math.floor(battery.chargeLevel) + "%";
    if(battery.chargeLevel <= 16 || charger.connected){ // Battery icon flows in
      meta_battery.y=50;
    }else{
      meta_battery.y=25;
    }
  }
}
if(alwaysOn != "true"){
  requestAnimationFrame(updateClock);
}
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
    if(alwaysOn!="true"){
      secHand.style.display = "inline";
    }else{
      secHand.style.display = "none";
    }

    date.style.display = "inline";
    day_box[0].style.display = "inline";
    day_box[1].style.display = "inline";

    center_text.style.display = "none";
    center_image.style.display = "none";

    bottom_clock.style.display = "none";
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
    bottom_clock.style.display = "inline";
    center_text.text = (today.local.steps || 0);
    center_image.href = "img/steps.png";
    center_image.height = 50;
    center_image.width = 50;
  }

  //Step 2 - Heart Rate
  var hrm = new HeartRateSensor();
  if(current_step == 2){
    center_image.href = "img/heartbeat.png";
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
    center_image.href = "img/calories.png";
    center_image.height = 50;
    center_image.width = 50;
  }

  //Step 4 - Floors
  if(current_step == 4){
    center_text.text = (today.local.elevationGain || 0);
    center_image.href = "img/floors.png";
    center_image.height = 50;
    center_image.width = 50;
  }

  //Step 5 - Active Minutes
  if(current_step == 5){
    center_text.text = (today.local.activeMinutes || 0);
    center_image.href = "img/active_minutes.png";
    center_image.height = 50;
    center_image.width = 50;
  }

  //Step 6 - Active Minutes
  if(current_step == 6){
    var distance = (today.local.distance / 1000).toFixed(2);
    center_text.text = (distance || 0);
    center_image.href = "img/distance.png";
    center_image.height = 50;
    center_image.width = 50;
  }

  //Back to step main
  if(current_step == 6){
    current_step = -1;
  }

  timeout = setTimeout(function(){
    current_step = 0;
    changeScene();
  }, 10000);
}

//Settings
var previous_color;
try{
  previous_color = fs.readFileSync("color_sec_hand.txt", "utf-8");
}catch(e){
  previous_color = "";
}
if(previous_color != ""){
  secHandElements.forEach(function(element){
    element.style.fill = previous_color;
  });
}

try{
  alwaysOn = fs.readFileSync("always_on.txt","utf-8");
}catch(e){
  alwaysOn = "false";
}
activateAlwaysOn(alwaysOn);

try{
  batteryCorner = fs.readFileSync("battery_corner.txt","utf-8");
}catch(e){
  batteryCorner = "false";
}
initBatteryCorner(batteryCorner);

//Finish settings

messaging.peerSocket.onopen = function() {
  console.log("open");
}
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}
messaging.peerSocket.onmessage = function(evt) {
  if(evt.data.key == "myColor"){
    secHandElements.forEach(function(element){
      element.style.fill = evt.data.value;
    });
    fs.writeFileSync("color_sec_hand.txt", evt.data.value, "utf-8");
    vibration.start("confirmation");
  }else if(evt.data.key == "alwaysOn"){
    alwaysOn = evt.data.value+"";

    activateAlwaysOn(alwaysOn);

    fs.writeFileSync("always_on.txt", evt.data.value+"", "utf-8");
  }else if(evt.data.key == "batteryCorner"){
    batteryCorner = evt.data.value+"";

    initBatteryCorner(batteryCorner);

    fs.writeFileSync("battery_corner.txt", evt.data.value+"", "utf-8");
  }
}

clock.ontick = function(evt) {
  if(alwaysOn=="true"){
    bottom_clock.text = ("0" + evt.date.getHours()).slice(-2) + ":" +
                        ("0" + evt.date.getMinutes()).slice(-2);
    updateClock();
  }else{
    bottom_clock.text = ("0" + evt.date.getHours()).slice(-2) + ":" +
                        ("0" + evt.date.getMinutes()).slice(-2) + ":" +
                        ("0" + evt.date.getSeconds()).slice(-2);
  }
};

function activateAlwaysOn(bool){
  if(bool == "true"){
    display.autoOff = false;
    display.addEventListener("change", turnOnDisplay);
    display.brightnessOverride = 0.0;
    clock.granularity = "minutes";
  }else{
    display.autoOff = true;
    display.addEventListener("change", turnOnDisplay);
    display.brightnessOverride = undefined;
    clock.granularity = "seconds";
    requestAnimationFrame(updateClock);
  }
}

function turnOnDisplay(){
  if(alwaysOn == "true" && !alwaysOnPaused){
    display.on = true;
  }else{

  }
}

function initBatteryCorner(state){
  console.log(state);
  if(state=="true"){
    meta_battery.style.display="inline";
  }else{
    meta_battery.style.display="none";
  }
}
