import React from 'react';
import { Chart } from '@poly-chart';

const mainStyle = {
   background: "rgb(0, 141, 210)",
   position: "relative",
   display: "block",
   height: "100vh",
   width: "100vw"
};

export const Demo = () => {

   //could be extracted from some prop
   const demoData = [{
      COOL: 200,
      LAME: 10,
      WOW: 150,
      THINGS: 170,
      STUFF: 100,
      HAPPY: 190
   }, {
      COOL: 100,
      LAME: 100,
      WOW: 100,
      THINGS: 30,
      STUFF: 302,
      HAPPY: 200
   }, {
      COOL: 150,
      LAME: 200,
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
         delay: [1000, 2000, 1000],
         duration: 500,
         easingFunction: 'easeOutElastic'
      },

      style: {

         label: { font: `${12.5 * window.devicePixelRatio}px serif` },

         chart: {
            background: true,
            fill: 'rgba(255, 255, 0, 1)',
            stroke: 'rgba(0, 0, 0, 1)'
         },

         polygon: {
            contour: true,
            fill: "rgba(255, 0, 0, 0.3)",
            stroke: 'rgba(255, 0, 0, 1)',
            lineWidth: 2
         }

      }

   };

   return (
      <main style={mainStyle}>
         <Chart data={demoData} options={demoOptions} />
      </main>
   );

};