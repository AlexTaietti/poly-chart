declare type EasingFunction = (progress: number) => number;
interface EasingDictionary {
    [easing: string]: EasingFunction;
}
export declare const easingFunctions: EasingDictionary;
export {};
