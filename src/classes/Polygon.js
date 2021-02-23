import { mergeObjects } from '../helpers/utils.js';

export class Polygon {

  constructor(data, options = {}) {

    const _defaults = {

      animation: {
        animate: false,
        duration: 0,
        delay: 0,
        easingFunction: undefined
      },

      style: {
        contour: true,
        fill: 'rgba(255, 0, 0, 0.4)',
        stroke: 'rgba(255, 0, 0, 1)',
        lineWidth: 2
      }

    };

    this.options = mergeObjects(_defaults, options, true);
    this.data = data;
    this.dataPoints = this.data.length;

    if (this.options.animation.animate) {
      this.animationProgress = 0;
      this.animated = false;
      this.animationStartTime = -1;
      this.animating = false;
      this.animated = false;
    }

  }

  draw(context, angleStep, valueStep) {

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

    if (this.options.style.contour) context.stroke();

    context.restore();

  }

  setStyle(context) {

    context.fillStyle = this.options.style.fill;
    context.strokeStyle = this.options.style.stroke;
    context.lineWidth = this.options.style.lineWidth;

  }

  animate(context, angleStep, valueStep) {

    if (this.animationStartTime < 0) this.animationStartTime = Date.now();

    const timeElapsed = Date.now() - this.animationStartTime;

    this.animationProgression = timeElapsed / this.options.animation.duration || 0;

    context.save();

    this.setStyle(context);

    //draw polygon
    context.beginPath();
    for (let i = 0; i < this.dataPoints; i++) {
      const currentAngle = angleStep * i;
      context.lineTo(Math.cos(currentAngle) * (valueStep * this.data[i] * this.options.animation.easingFunction(this.animationProgression)), Math.sin(currentAngle) * (valueStep * this.data[i] * this.options.animation.easingFunction(this.animationProgression)));
    }
    context.closePath();
    context.fill();

    if (this.options.style.contour) context.stroke();

    context.restore();

    if (this.animationProgression > 1) {
      this.animationStartTime = -1;
      this.animationProgress = 1;
      this.animating = false;
      this.animated = true;
      return this.options.animation.delay;
    }

  }

  pauseAnimation() { this.animating = false; }

  resumeAnimation() { this.animating = true; }

}