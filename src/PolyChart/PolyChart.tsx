import React, { useRef, useEffect } from 'react';
import { PolygonChart } from '../classes';
import { PolygonChartOptions } from '../classes/PolygonChart';

type PolyChartProps = {

   data: object | Array<object[]>;

   options: PolygonChartOptions;

};

const chartContainerStyle: React.CSSProperties = {
   display: "block",
   height: "100%",
   position: "relative",
   width: "100%"
};

export const PolyChart: React.FC<PolyChartProps> = ({ data, options }) => {

   const container = useRef<HTMLDivElement>(null);

   const chart = useRef<PolygonChart>();

   useEffect(() => {

      chart.current = new PolygonChart(container.current);

      return chart.current.setResizeHandler();

   }, []);

   useEffect(() => { chart.current?.updateOptions(options); }, [options]);

   useEffect(() => { chart.current?.updateData(data); }, [data]);

   useEffect(() => { chart.current?.masterDraw(); }, [options, data]);

   return <div style={chartContainerStyle} aria-label='chart' ref={container} />;

};
