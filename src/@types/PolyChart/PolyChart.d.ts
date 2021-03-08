import React from 'react';
import { PolygonChartOptions } from '../classes/PolygonChart';
declare type PolyChartProps = {
    data: object | Array<object[]>;
    options: PolygonChartOptions;
};
export declare const PolyChart: React.FC<PolyChartProps>;
export {};
