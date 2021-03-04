//generic nested array interface: tinyurl.com/2ffjhrwv
type ValueOrArray<T> = T | ArrayOfValueOrArray<T>;
interface ArrayOfValueOrArray<T> extends Array<ValueOrArray<T>> { }

//I cannot figure out how to correctly type this merge function, any suggestions would be extremely welcome
export function mergeOptions(defaultObject: any, other: any, deep?: boolean) {

  for (const prop in other) {

    if (!other.hasOwnProperty(prop) || (prop == "__proto__" || prop == "constructor")) continue;

    if (defaultObject.hasOwnProperty(prop) && defaultObject[prop] !== undefined && other[prop] === undefined) { continue; }

    if (defaultObject.hasOwnProperty(prop) && other[prop] && other[prop].toString() === '[object Object]' && deep) {

      mergeOptions(defaultObject[prop], other[prop], true);

    } else { defaultObject[prop] = other[prop]; }

  }

  return defaultObject;

}

export function createFittingCanvas(element: HTMLDivElement): [HTMLDivElement, HTMLCanvasElement, CanvasRenderingContext2D] {

  const canvas = document.createElement('canvas');

  const context = canvas.getContext('2d');

  if (!context) throw new Error(`2d context not supported or canvas already initialized`);

  const minDimension = Math.min(element.clientWidth, element.clientHeight);

  const pixelRatio = window.devicePixelRatio;

  canvas.style.height = canvas.style.width = `${minDimension + "px"}`;

  canvas.style.position = "absolute";

  canvas.style.top = `${element.clientHeight / 2}px`;

  canvas.style.left = `${element.clientWidth / 2}px`;

  canvas.style.transform = "translate(-50%, -50%)";

  context.canvas.width = context.canvas.height = Math.floor(minDimension * pixelRatio);

  context.canvas.tabIndex = 0;

  element.append(canvas);

  return [element, canvas, context];

}

export function extractDataFrom(array: Array<object>): Array<number[]> {

  const data = [];

  for (let i = 0; i < array.length; i++) {
    data.push(Object.values(array[i]));
  }

  return data;

}

export function getLongestStringWidth(font: string, stringArray: Array<string>) {

  const canvas = document.createElement('canvas');

  const context = canvas.getContext('2d');

  if (!context) throw new Error(`2d context not supported or canvas already initialized`);

  context.font = font;

  let widest = 0;

  for (let i = 0; i < stringArray.length; i++) {
    const currentWidth = context.measureText(stringArray[i]).width;
    if (currentWidth > widest) widest = currentWidth;
  }

  return widest;

}

export function getMaxValueInArray(array: ArrayOfValueOrArray<number>, previousHighest: number = 0) {

  let highest = previousHighest || 0;

  for (let i = 0; i < array.length; i++) {

    if (Array.isArray(array[i])) {

      const deepHighest: number = getMaxValueInArray(array[i] as Array<number>, highest);
      if (highest < deepHighest) highest = deepHighest;

    } else {

      if (highest < array[i]) highest = array[i] as number;

    }

  }

  return highest;

}
