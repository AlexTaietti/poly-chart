# `PolyChart`
A bare-bones canvas based component for data visualization in React. This chart is customizable, animated (tweenable too) and responsive.

<p align="center"><img src="https://github.com/AlexTaietti/poly-chart/blob/master/preview/poly-chart.gif" width="80%"/></p>

## Installation
`npm install poly-chart`

## Usage

### general
```js
import { PolyChart } from 'poly-chart';

const MyComponent = (props) => {

   //can be either a single object or an array of objects with identical keys (keys are used as labels)
   const demoData = [...]; 

   //look below for options object interface
   const demoOptions = {...};

   return (
      <MyComponent style={mainStyle}>
         <PolyChart data={demoData} options={demoOptions} />
      </MyComponent>
   );

};
```
### options object examples
```js
const complexOptions = {

	increments: 10,
	
	animation: {
		tween: true,
		delay: [0, 500, 1000], //if an array is supplied each entry will be assinged to the polygon with the corresponding index
		duration: [2000, 1000, 5000],
		easingFunction: ['easeOutElastic', 'easeOutBounce', 'linear']
	},

	style: {
	
		label: { font: `20px Helvetica` },
		
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
```
```js
const simpleOptions = {

	increments: 5,

	style: {
	
		label: { font: `16px sans-serif` },
		
		chart: { stroke: 'rgba(0, 0, 0, 1)' },
		
		polygon: { fill: 'rgba(0, 210, 79, 0.6)' }
	
	}

};
```