import { mergeOptions } from '../helpers/utils';
import { easingFunctions } from '../helpers/easingFunctions';

type PolygonOptions = {

  animation?: {
    duration: number,
    easingFunction: string,
    delay?: number,
    animated?: boolean;
    progress?: number;
    animationStartTime?: number;
    animating?: boolean;
  };

  style: {
    contour: boolean,
    fill: string,
    stroke: string,
    lineWidth: number
  };

};

export class Polygon {

  options: PolygonOptions;

  data: Array<number>;
  dataPoints: number;

  constructor(data: Array<number>, options: object) {

    const _defaults: PolygonOptions = {

      style: {
        contour: true,
        fill: 'rgba(255, 0, 0, 0.4)',
        stroke: 'rgba(255, 0, 0, 1)',
        lineWidth: 2
      }

    };

    this.options = mergeOptions(_defaults, options, true);
    this.data = data;
    this.dataPoints = this.data.length;

    if (this.options.animation) {
      if (!this.options.animation.delay) this.options.animation.delay = 0;
      this.options.animation.progress = 0;
      this.options.animation.animated = false;
      this.options.animation.animationStartTime = -1;
      this.options.animation.animating = false;
    }

  }

  draw(context: CanvasRenderingContext2D, angleStep: number, valueStep: number) {

    context.save();

    this.setStyle(context);

    //draw polygon
    context.beginPath();
    for (let i = 0; i < this.dataPoints; i++) {
      const currentAngle = angleStep * i;
      context.lineTo(Math.cos(currentAngle) * (valueStep * this.data[i]), Math.sin(currentAngle) * (valueStep * this.data[i]));
    }
    context.closePath();
    context.fill();

    if (this.options.style && this.options.style.contour) context.stroke();

    context.restore();

  }

  setStyle(context: CanvasRenderingContext2D) {

    context.fillStyle = this.options.style.fill;
    context.strokeStyle = this.options.style.stroke;
    context.lineWidth = this.options.style.lineWidth;

  }

  animate(context: CanvasRenderingContext2D, angleStep: number, valueStep: number) {

    if (!this.options.animation) throw new Error(`Hello, polygon with data {${this.data}} speaking, if you want to either animate me or tween me with other polygons remember to initialise my animation props!`);

    if (this.options.animation.animated) {

      this.draw(context, angleStep, valueStep);

      return true;

    }

    if (!this.options.animation.animationStartTime || this.options.animation.animationStartTime < 0) this.options.animation.animationStartTime = Date.now();

    const timeElapsed = Date.now() - this.options.animation.animationStartTime;

    this.options.animation.progress = timeElapsed / (this.options.animation.duration || 0);

    context.save();

    this.setStyle(context);

    context.beginPath();
    for (let i = 0; i < this.dataPoints; i++) {
      const currentAngle = angleStep * i;
      context.lineTo(Math.cos(currentAngle) * (valueStep * this.data[i] * easingFunctions[this.options.animation.easingFunction](this.options.animation.progress)), Math.sin(currentAngle) * (valueStep * this.data[i] * easingFunctions[this.options.animation.easingFunction](this.options.animation.progress)));
    }
    context.closePath();
    context.fill();

    if (this.options.style.contour) context.stroke();

    context.restore();

    if (this.options.animation.progress > 1) {
      this.options.animation.animationStartTime = -1;
      this.options.animation.progress = 1;
      this.options.animation.animating = false;
      this.options.animation.animated = true;
      return true;
    }

    return false;

  }

};