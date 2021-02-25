import React from 'react';
import { PolyChart } from '@poly-chart';

const mainStyle = {
   background: "rgb(0, 141, 210)",
   position: "fixed",
   height: "100%",
   width: "100%"
};

export const Demo = () => {

   //could be extracted from some prop
   const demoData = [{
      COOL: 200,
      LOVE: 10,
      WOW: 150,
      THINGS: 170,
      STUFF: 100,
      HAPPY: 190
   }, {
      COOL: 100,
      LOVE: 100,
      WOW: 100,
      THINGS: 30,
      STUFF: 302,
      HAPPY: 200
   }, {
      COOL: 150,
      LOVE: 200,
      WOW: 100,
      THINGS: 150,
      STUFF: 100,
      HAPPY: 50
   }];

   //could be created inside a hook for example, after processing the props
   const demoOptions = {

      increments: 10,

      animation: {
         tween: true,
         delay: [0, 500, 1000],
         duration: [2000, 1000, 5000],
         easingFunction: ['easeOutElastic', 'easeOutBounce', 'linear']
      },

      style: {

         label: { font: `${12.5 * window.devicePixelRatio}px Helvetica` },

         chart: {
            background: true,
            fill: 'rgba(255, 255, 0, 1)',
            stroke: 'rgba(0, 0, 0, 1)'
         },

         polygon: {
            contour: true,
            fill: ['rgba(3, 5, 183, 0.6)', 'rgba(255, 0, 0, 0.6)', 'rgba(0, 210, 79, 0.6)'],
            stroke: ['rgb(3, 5, 183)', 'rgb(255, 0, 0)', 'rgb(0, 210, 79)'],
            lineWidth: 2
         }

      }

   };

   return (
      <main style={mainStyle}>
         <PolyChart data={demoData} options={demoOptions} />
      </main>
   );

};