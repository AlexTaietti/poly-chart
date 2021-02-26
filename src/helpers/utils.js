export function mergeObjects(object, other, deep) {

  for (const prop in other) {

    if (!other.hasOwnProperty(prop) || (prop == "__proto__" || prop == "constructor")) continue;

    if (other[prop].toString() === '[object Object]' && deep) {

      mergeObjects(object[prop], other[prop], true);

    } else { object[prop] = other[prop]; }

  }

  return object;

}

export function createFittingCanvas(element) {

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const minDimension = Math.min(element.clientWidth, element.clientHeight);

  const pixelRatio = window.devicePixelRatio;

  canvas.style.height = canvas.style.width = `${minDimension + "px"}`;

  canvas.style.position = "absolute";

  canvas.style.top = `${element.clientHeight / 2}px`;

  canvas.style.left = `${element.clientWidth / 2}px`;

  canvas.style.transform = "translate(-50%, -50%)";

  context.canvas.width = context.canvas.height = Math.floor(minDimension * pixelRatio);

  context.canvas.tabIndex = "0";

  element.append(canvas);

  return [element, canvas, context];

}

export function getLongestStringWidth(font, stringArray) {

  const context = document.createElement('canvas').getContext('2d');

  context.font = font;

  let widest = 0;

  for (let i = 0; i < stringArray.length; i++) {
    const currentWidth = context.measureText(stringArray[i]).width;
    if (currentWidth > widest) widest = currentWidth;
  }

  return widest;

}

export function getMaxValueInArray(array, previousHighest) {

  let highest = previousHighest || 0;

  for (let i = 0; i < array.length; i++) {

    if (array[i].length) {
      const deepHighest = getMaxValueInArray(array[i], highest);
      if (highest < deepHighest) highest = deepHighest;
    } else {
      if (highest < array[i]) highest = array[i];
    }

  }

  return highest;

}
