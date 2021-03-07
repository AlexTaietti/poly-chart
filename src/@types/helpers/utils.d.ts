declare type ValueOrArray<T> = T | ArrayOfValueOrArray<T>;
interface ArrayOfValueOrArray<T> extends Array<ValueOrArray<T>> {
}
export declare function mergeOptions(defaultObject: any, other: any, deep?: boolean): any;
export declare function createFittingCanvas(element: HTMLDivElement): [HTMLDivElement, HTMLCanvasElement, CanvasRenderingContext2D];
export declare function extractDataFrom(array: Array<object>): Array<number[]>;
export declare function getLongestStringWidth(font: string, stringArray: Array<string>): number;
export declare function getMaxValueInArray(array: ArrayOfValueOrArray<number>, previousHighest?: number): number;
export {};
