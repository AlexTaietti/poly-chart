declare type PolygonOptions = {
    animation?: {
        duration: number;
        easingFunction: string;
        delay?: number;
        animated?: boolean;
        progress?: number;
        animationStartTime?: number;
        animating?: boolean;
    };
    style: {
        contour: boolean;
        fill: string;
        stroke: string;
        lineWidth: number;
    };
};
export declare class Polygon {
    options: PolygonOptions;
    data: Array<number>;
    dataPoints: number;
    constructor(data: Array<number>, options: object);
    draw(context: CanvasRenderingContext2D, angleStep: number, valueStep: number): void;
    setStyle(context: CanvasRenderingContext2D): void;
    animate(context: CanvasRenderingContext2D, angleStep: number, valueStep: number): boolean;
}
export {};
