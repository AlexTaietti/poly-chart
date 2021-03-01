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
   const demoData = [
      {
         HP: 200,
         ATTACK: 170,
         DEFENSE: 110,
         SPECIAL: 100,
         SPEED: 150,
         STAMINA: 190
      },
      {
         HP: 100,
         ATTACK: 100,
         DEFENSE: 100,
         SPECIAL: 130,
         SPEED: 300,
         STAMINA: 200
      },
      {
         HP: 150,
         ATTACK: 100,
         DEFENSE: 200,
         SPECIAL: 150,
         SPEED: 100,
         STAMINA: 120
      }
   ];

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

         label: {
            fontFamily: 'Helvetica',
            fontSize: 12.5
         },

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