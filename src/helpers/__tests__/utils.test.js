import { mergeObjects, getMaxValueInArray } from "../utils";

describe('getMaxValueInArray: returns the highest value in an array of numbers', () => {

   test('Returns the highest value in one-dimensional array of integers', () => {

      const array = [1000, 2000, 1000000, 1, 200, 100, 420, 69];

      expect(getMaxValueInArray(array)).toBe(1000000);

   });

   test('Returns the highest value in two-dimensional array of integers', () => {

      const array = [1000, [2000, 200, 2, 100, 10000, 300000000], 1000000, 1, 200, 100, 420, 69];

      expect(getMaxValueInArray(array)).toBe(300000000);

   });

});

describe('mergeObjects: returns a merged object', () => {

   test('Merges two shallow objects', () => {

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

   test('Merges two objects with complex values', () => {

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