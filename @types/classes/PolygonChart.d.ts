import { Polygon } from './Polygon';
declare type PolygonChartOptions = {
    debugging?: boolean;
    maxValue?: number;
    description?: string;
    increments?: number;
    animation?: {
        tween?: boolean;
        animated?: boolean | Array<boolean>;
        duration: number | Array<number>;
        delay?: number | Array<number>;
        easingFunction: string | Array<string>;
    };
    style?: {
        chart?: {
            background?: boolean;
            fill?: string;
            stroke?: string;
            lineWidth?: number;
        };
        label?: {
            contour?: boolean;
            fontSize: number;
            fontFamily: string;
            fill?: string;
            stroke?: string;
            lineWidth?: number;
        };
        polygon?: {
            contour?: boolean | Array<boolean>;
            fill?: string | Array<string>;
            stroke?: string | Array<string>;
            lineWidth?: number | Array<number>;
        };
    };
};
export declare class PolygonChart {
    container: HTMLDivElement;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    options: PolygonChartOptions;
    labels: Array<string>;
    dataDimensions: number;
    data: Array<number> | Array<number[]>;
    poly: Polygon | Array<Polygon>;
    currentPolygon: number;
    widestLabel: number;
    position: {
        x: number;
        y: number;
    };
    labelMargin: number;
    radius: number;
    increments: number;
    incrementStep: number;
    angleStep: number;
    maxValue: number;
    valueStep: number;
    frameID: number;
    timeoutID: number;
    constructor(element: HTMLDivElement);
    setResizeHandler(): () => void;
    updateData(newData: object | Array<object>): void;
    updateOptions(newOptions: object): void;
    masterDraw(): void;
    setChartStyle(): void;
    setLabelStyle(): void;
    drawLabels(): void;
    drawChart(): void;
    draw(index?: number | undefined, lastIndex?: number | undefined): void;
    basicAnimate(): void;
    tween(): number;
    animate(): void;
    clearCanvas(): void;
    resizeAndCenter(): void;
}
export {};
