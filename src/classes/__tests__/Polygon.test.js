import { Polygon } from '../Polygon';

describe('Polygon: class used to represent individual data entries in the chart', () => {

   test('create a polygon with specific values without exploding', () => {

      const testPoly = new Polygon([10, 100, 200, 20, 10, 1], {

         style: {
            contour: true,
            fill: 'rgba(255, 0, 0, 0.4)',
            stroke: 'rgba(255, 0, 0, 1)',
            lineWidth: 2
         }

      });

      expect(testPoly).toBeInstanceOf(Polygon);

   });

});