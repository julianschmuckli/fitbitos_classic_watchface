import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { locale } from "user-settings";
import { me } from "companion";

let KEY_COLOR = "secondsColor";
let KEY_COLOR_HOURS_MINUTES = "hoursminutesColor";
let KEY_ALWAYSON = "alwaysOn";
let KEY_BATTERY = "batteryCorner";

// Settings have been changed
settingsStorage.onchange = function(evt) {
  console.log("Settings changed");
  sendValue(evt.key, evt.newValue);
}

// Settings were changed while the companion was not running
if (me.launchReasons.settingsChanged) {
  // Send the value of the setting
  sendValue(KEY_COLOR, settingsStorage.getItem(KEY_COLOR));
  sendValue(KEY_COLOR_HOURS_MINUTES, settingsStorage.getItem(KEY_COLOR_HOURS_MINUTES));
  sendValue(KEY_ALWAYSON, settingsStorage.getItem(KEY_ALWAYSON));
  sendValue(KEY_BATTERY, settingsStorage.getItem(KEY_BATTERY));
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}
function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}

function translate(key, value_de, value_en){
  console.log(language);
  switch(language){
    case 'de_DE':
    case 'de_CH':
    case 'de_AT':
    case 'de-DE':
    case 'de-CH':
    case 'de-AT':
      settingsStorage.setItem("t_"+key, value_de);
      break;
    default:
      settingsStorage.setItem("t_"+key, value_en);
      break;
  }
}
