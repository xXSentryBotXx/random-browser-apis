console.log("main script loaded");

const $noGamepadMessage = document.getElementById('no-gamepad-message');
const gamepads = [];
const gamepadComponents = [];

let interval;

if ( !('ongamepadconnected' in window) ) {
  // No gamepad events available, poll instead.
  console.log('No gamepad events available, poll instead.')
  interval = setInterval(pollGamepads, 5000);
}

function pollGamepads() {
  const gamepadList = navigator.getGamepads ? navigator.getGamepads() : ( navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [] );
  console.log('Gamepad List: ', gamepadList);

  for (let i = 0; i < gamepadList.length; i++) {
    const currentGamepad = gamepadList[i];

    if (currentGamepad) {
      gamepads.push(currentGamepad)
      console.log("Gamepad connected at index " + currentGamepad.index + ": " + currentGamepad.id +
        ". It has " + currentGamepad.buaxesength + " buttons and " + currentGamepad.axes.length + " axes.");
      buildGamepadUI(currentGamepad);
      clearInterval(interval);
      gameLoop();
    }
  }
}

function buildGamepadUI(gp) {
  console.log(gp);
  const gamepadIndex = gp.index;
  const axes = gp.axes;
  const buttons = gp.buttons;
  const vibrationActuator = gp.vibrationActuator

  const $gamepad = document.createElement('div');
  const $gamepadButtonList = document.createElement('div');
  const $gamepadAxesList = document.createElement('div');
  const $gamepadActuatorsList = document.createElement('div');

  $gamepad.classList.add('gamepad')
  $gamepadButtonList.classList.add('gamepad-section')
  $gamepadAxesList.classList.add('gamepad-section')
  $gamepadActuatorsList.classList.add('gamepad-section')

  let gamepadHTMLText = `<h2 class="gamepad-title">${gp.id}</h2>`;
  let gamepadButtonListHTMLText = buttons.map((btn, idx) => `<div id="button-${idx}" class="gamepad-button">Button ${idx}</div>`).join('');
  let gamepadAxesListHTMLText = axes.map((axes, idx) => `<div id="axes-${idx}" class="gamepad-axes">Axes ${idx}:<div id="axes-text-${idx}" class="gamepad-axes-text">${axes.toFixed(5)}</div></div>`).join('');
  let gamepadActuatorsListHTMLText = `<button id="${vibrationActuator.type}-${gamepadIndex}" class="gamepad-actuator">${vibrationActuator.type}</button>`;

  $gamepad.innerHTML = gamepadHTMLText;
  $gamepadButtonList.innerHTML = gamepadButtonListHTMLText;
  $gamepadAxesList.innerHTML = gamepadAxesListHTMLText;
  $gamepadActuatorsList.innerHTML = gamepadActuatorsListHTMLText;

  $noGamepadMessage.classList.add('hidden');

  $gamepad.appendChild($gamepadButtonList)
  $gamepad.appendChild($gamepadAxesList)
  $gamepad.appendChild($gamepadActuatorsList)

  document.body.appendChild($gamepad);

  gamepadComponents.push($gamepad);

  $gamepadActuatorBtn = $gamepad.querySelector(`#${vibrationActuator.type}-${gamepadIndex}`);
  $gamepadActuatorBtn.addEventListener('click', async function (e) {
    await vibrationActuator.playEffect(vibrationActuator.type, {
      duration: 1000,
      strongMagnitude: 1,
      weakMagnitude: 1
    })
  });
}

function gameLoop() {

  const gamepadList = navigator.getGamepads ? navigator.getGamepads() : ( navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [] );

  for (let i = 0; i < gamepadList.length; i++) {
    const currentGamepad = gamepadList[i];

    if (currentGamepad) {
      currentGamepad.buttons.forEach( (button, idx) => {
        checkButtonPress(button, idx, currentGamepad.index);
      });

      currentGamepad.axes.forEach( (axes, idx) => {
        updateAxes(axes, idx, currentGamepad.index);
      });
    }
  }

  requestAnimationFrame(gameLoop);
}

function checkButtonPress(button, btnIdx, gpIdx) {
  $button = gamepadComponents[gpIdx].querySelector(`#button-${btnIdx}`);
  if (button.pressed) {
    $button.classList.add('pressed');
  } else {
    $button.classList.remove('pressed');
  }
}

function updateAxes(axes, axesIdx, gpIdx) {
  $axesText = gamepadComponents[gpIdx].querySelector(`#axes-text-${axesIdx}`);
  $axesText.innerText = axes.toFixed(5)
}

// var gamepads = {};

// function gamepadHandler(event, connecting) {
//   var gamepad = event.gamepad;
//   // Note:
//   // gamepad === navigator.getGamepads()[gamepad.index]

//   if (connecting) {
//     gamepads[gamepad.index] = gamepad;
//   } else {
//     delete gamepads[gamepad.index];
//   }
// }

// window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); }, false);
// window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);