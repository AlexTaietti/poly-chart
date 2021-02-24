import { mergeObjects, createFittingCanvas, getLongestStringWidth, getMaxValueInArray } from "../utils";

describe('getMaxValueInArray: returns the highest value in an array of numbers', () => {

   test('return the highest value in one-dimensional array of integers', () => {

      const numbers = [1000, 2000, 1000000, 1, 200, 100, 420, 69];

      expect(getMaxValueInArray(numbers)).toBe(1000000);

   });

   test('return the highest value in two-dimensional array of integers', () => {

      const numbers = [1000, [2000, 200, 2, 100, 10000, 300000000], 1000000, 1, 200, 100, 420, 69];

      expect(getMaxValueInArray(numbers)).toBe(300000000);

   });

});

describe('mergeObjects: returns a merged object', () => {

   test('merge two shallow objects', () => {

      const firstObject = { a: 100, b: 'hello', c: 'world', d: 1, e: 2020 };

      const secondObject = { a: 1000, b: 'ciao', c: 'world', d: 10 };

      const expectedResult = {
         a: 1000,
         b: 'ciao',
         c: 'world',
         d: 10,
         e: 2020
      }

      expect(mergeObjects(firstObject, secondObject)).toEqual(expectedResult);

   });

   test('merge two objects with complex values', () => {

      const firstObject = {

         a: [1000, 20, 10, 20],
         b: { firstName: 'Alex', secondName: 'Taietti' },
         c: 'world',
         d: { greeting: 'ciao' },
         e: 2020

      };

      const secondObject = {

         a: [1, 2, 3],
         b: { firstName: 'Lionel', secondName: 'Messi' },
         c: 'world',
         d: { greeting: 'hello' }

      };

      const expectedResult = {
         a: [1, 2, 3],
         b: { firstName: 'Lionel', secondName: 'Messi' },
         c: 'world',
         d: { greeting: 'hello' },
         e: 2020
      }

      expect(mergeObjects(firstObject, secondObject)).toEqual(expectedResult);

   });

});

describe('getLongestStringWidth: return the width of the longest string from an array of strings based on its length when rendered in a canvas', () => {

   test('return the width of the longest string', () => {

      const longestString = 'supremelyUnecessarilyLongString';
      const secondLongest = 'unecessarilyLongString';

      const strings = ['normal', 'strings', longestString, 'some', 'more', 'strings'];
      const moreStrings = ['normal', 'strings', secondLongest, 'some', 'more', 'strings'];

      const testFont = '20px sans-serif';

      const expectedMaxLength = getLongestStringWidth(testFont, strings);
      const expectedShorterLength = getLongestStringWidth(testFont, moreStrings);

      expect(expectedMaxLength).toBeGreaterThan(expectedShorterLength);

   });

});

describe('createFittingCanvas: creates a canvas that fits inside a supplied HTML element, appends it to it. Returns a reference to said element, a 2d context and the fitted canvas', () => {

   test("return the same container passed to the function originally", () => {

      const mockContainerElement = document.createElement('div');

      mockContainerElement.style.width = "500px";
      mockContainerElement.style.height = "200px";

      const [referenceToMockContainer, ...rest] = createFittingCanvas(mockContainerElement);

      expect(referenceToMockContainer).toBe(mockContainerElement);

   });

});