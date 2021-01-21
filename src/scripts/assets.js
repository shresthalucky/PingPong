// Game image and sounds
let sprite;
let referee;
let bounceIn;
let bounceOut;
let batHit;
let clapHigh;
let clapLow;

export function initAssets(callbackFn) {
  sprite = new Image();
  // sprite.src = App.assets.src + 'sprite.png';
  sprite.src = require('../assets/sprite.png');
  sprite.onload = callbackFn;

  referee = document.createElement('audio');
  document.body.appendChild(referee);
  referee.addEventListener('canplaythrough', callbackFn);
  referee.setAttribute('src', require('../assets/sounds/referee.mp3'));

  bounceIn = document.createElement('audio');
  document.body.appendChild(bounceIn);
  bounceIn.addEventListener('canplaythrough', callbackFn);
  bounceIn.setAttribute('src', require('../assets/sounds/bounce1.mp3'));

  bounceOut = document.createElement('audio');
  document.body.appendChild(bounceOut);
  bounceOut.addEventListener('canplaythrough', callbackFn);
  bounceOut.setAttribute('src', require('../assets/sounds/bounce2.mp3'));

  batHit = document.createElement('audio');
  document.body.appendChild(batHit);
  batHit.addEventListener('canplaythrough', callbackFn);
  batHit.setAttribute('src', require('../assets/sounds/hit.mp3'));

  clapHigh = document.createElement('audio');
  document.body.appendChild(clapHigh);
  clapHigh.addEventListener('canplaythrough', callbackFn);
  clapHigh.setAttribute('src', require('../assets/sounds/clap1.mp3'));

  clapLow = document.createElement('audio');
  document.body.appendChild(clapLow);
  clapLow.addEventListener('canplaythrough', callbackFn);
  clapLow.setAttribute('src', require('../assets/sounds/clap2.mp3'));
}

export function removeAssetsEvent(callbackFn) {
  referee.removeEventListener('canplaythrough', callbackFn);
  bounceIn.removeEventListener('canplaythrough', callbackFn);
  bounceOut.removeEventListener('canplaythrough', callbackFn);
  batHit.removeEventListener('canplaythrough', callbackFn);
  clapHigh.removeEventListener('canplaythrough', callbackFn);
  clapLow.removeEventListener('canplaythrough', callbackFn);
}

export { sprite, referee, bounceIn, bounceOut, batHit, clapHigh, clapLow };
