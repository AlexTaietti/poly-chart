import React, { useRef, useEffect } from 'react';
import { PolygonChart } from '../classes';

const chartContainerStyle = {
   display: "block",
   height: "100%",
   position: "relative",
   width: "100%"
};

export const PolyChart = ({ data, options }) => {

   const container = useRef();

   const chart = useRef();

   useEffect(() => {

      chart.current = new PolygonChart(container.current);

      return chart.current.setResizeHandler();

   }, []);

   useEffect(() => { chart.current.updateOptions(options); }, [options]);

   useEffect(() => { chart.current.updateData(data); }, [data]);

   useEffect(() => { chart.current.masterDraw(); }, [options, data]);

   return <div style={chartContainerStyle} aria-label='chart' ref={container} />;

};
