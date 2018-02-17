import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { locale } from "user-settings";
import { me } from "companion";

let KEY_COLOR = "myColor";

//Translations
let language = locale.language;

settingsStorage.setItem("myColor", 5);

translate("color_seconds_hand","Farbe des Sekundenzeigers","Color of seconds hand");

// Settings have been changed
settingsStorage.onchange = function(evt) {
  sendValue(evt.key, evt.newValue);
}

// Settings were changed while the companion was not running
if (me.launchReasons.settingsChanged) {
  // Send the value of the setting
  sendValue(KEY_COLOR, settingsStorage.getItem(KEY_COLOR));
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
      settingsStorage.setItem("t_"+key, value_de);
      break;
    default:
      settingsStorage.setItem("t_"+key, value_en);
      break;
  }
}