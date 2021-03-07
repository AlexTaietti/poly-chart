import React, { useRef, useEffect } from 'react';
import { PolygonChart, PolygonChartOptions } from '../classes';

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

   const container = useRef<HTMLDivElement | null>(null);

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
