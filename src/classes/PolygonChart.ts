import { extractDataFrom, mergeOptions, createFittingCanvas, getLongestStringWidth, getMaxValueInArray } from '../helpers/utils';
import { Polygon } from './Polygon';

type PolygonChartOptions = {

  debugging?: boolean;

  maxValue?: number;

  description?: string;

  increments?: number;

  animation?: {
    tween?: boolean,
    animated?: boolean | Array<boolean>,
    duration: number | Array<number>,
    delay?: number | Array<number>,
    easingFunction: string | Array<string>
  };

  style?: {

    chart?: {
      background?: boolean,
      fill?: string,
      stroke?: string,
      lineWidth?: number
    },

    label?: {
      contour?: boolean,
      fontSize: number,
      fontFamily: string,
      fill?: string,
      stroke?: string,
      lineWidth?: number
    },

    polygon?: {
      contour?: boolean | Array<boolean>,
      fill?: string | Array<string>,
      stroke?: string | Array<string>,
      lineWidth?: number | Array<number>
    }

  };

};

export class PolygonChart {

  container: HTMLDivElement;

  canvas: HTMLCanvasElement;

  context: CanvasRenderingContext2D;

  options: PolygonChartOptions;

  labels: Array<string>;

  dataDimensions: number;

  data: Array<number> | Array<number[]>;

  originalData: object | Array<object>;

  poly: Polygon | Array<Polygon>;

  currentPolygon: number;

  widestLabel: number;

  position: {
    x: number,
    y: number
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

  //create a canvas and fit it to a given container element
  constructor(element: HTMLDivElement) {

    [this.container, this.canvas, this.context] = createFittingCanvas(element);

  }

  //hook resize handlers to the window
  setResizeHandler() {

    if (this.options && this.options.debugging) console.warn('PolygonChart: Hooking resize handlers to the window object');

    window.addEventListener('resize', this.resizeAndCenter.bind(this));

    return () => {

      if (this.options && this.options.debugging) console.warn('PolygonChart: Unmounting chart and cleaning up event handlers');

      window.removeEventListener('resize', this.resizeAndCenter);

    }

  }

  updateData(newData: object | Array<object>) {

    if (this.options && this.options.debugging) console.warn("PolygonChart: updating chart's data with:\n\ndata = " + JSON.stringify(newData, null, 3) + "\n\n----------\n\nSo far these are the supplied options:\n\noptions = " + JSON.stringify(this.options, null, 3));

    const _that = this;

    this.originalData = newData;

    if (Array.isArray(newData)) {

      this.labels = Object.keys(newData[0]);
      this.dataDimensions = this.labels.length;
      this.data = extractDataFrom(newData);
      this.poly = [];
      this.currentPolygon = -1;

      for (let i = 0; i < this.data.length; i++) {

        const { tween, animated, duration, delay, easingFunction } = this.options.animation || {};

        const { contour, fill, stroke, lineWidth } = this.options.style && this.options.style.polygon || {};

        const polygon = new Polygon(this.data[i], {

          animation: animated || (Array.isArray(animated)) || tween ? {
            duration: Array.isArray(duration) ? duration[i] : duration,
            delay: Array.isArray(delay) ? delay[i] : delay,
            easingFunction: Array.isArray(easingFunction) ? easingFunction[i] : easingFunction,
          } : undefined,

          style: {
            contour: Array.isArray(contour) ? contour[i] : contour,
            fill: Array.isArray(fill) ? fill[i] : fill,
            stroke: Array.isArray(stroke) ? stroke[i] : stroke,
            lineWidth: Array.isArray(lineWidth) ? lineWidth[i] : lineWidth
          }

        });

        this.poly.push(polygon);

      }

    } else {

      this.labels = Object.keys(newData);
      this.dataDimensions = this.labels.length;
      this.data = Object.values(newData) as Array<number>;

      const { animated, duration, delay, easingFunction } = this.options.animation || {};

      const { contour, fill, stroke, lineWidth } = this.options.style && this.options.style.polygon || {};

      this.poly = new Polygon(this.data, {

        animation: {
          animate: animated,
          duration: duration,
          delay: delay,
          easingFunction: easingFunction
        },

        style: {
          contour: contour,
          fill: fill,
          stroke: stroke,
          lineWidth: lineWidth
        }

      });

    }

    const labelWidthTestFont = this.options.style && this.options.style.label ? `${this.options.style.label.fontSize * window.devicePixelRatio}px ${this.options.style.label.fontFamily}` : `${16 * window.devicePixelRatio}px sans-serif`;

    this.widestLabel = getLongestStringWidth(labelWidthTestFont, this.labels);

    this.position = {
      x: _that.context.canvas.width / 2,
      y: _that.context.canvas.height / 2
    };

    this.labelMargin = 5; //TODO: find a way to calculate this here
    this.radius = ((this.context.canvas.width / 2) - this.widestLabel) - this.labelMargin;
    this.increments = this.options.increments || 10;
    this.incrementStep = this.radius / this.increments;
    this.angleStep = (Math.PI * 2) / this.dataDimensions;

    //data properties
    this.maxValue = this.options.maxValue ? this.options.maxValue : getMaxValueInArray(this.data);
    this.valueStep = this.radius / this.maxValue;

  }

  updateOptions(newOptions: object) {

    if (this.options && this.options.debugging) console.warn('PolygonChart: updating chart options with this object:\n' + JSON.stringify(newOptions, null, 3));

    const _defaults: PolygonChartOptions = {

      increments: 10,

      style: {

        chart: {
          stroke: 'rgba(0, 0, 0, 1)',
          lineWidth: 1
        },

        label: {
          fontSize: 16,
          fontFamily: 'sans-serif',
          fill: 'rgba(0, 0, 0, 1)'
        }

      }

    };

    this.options = mergeOptions(_defaults, newOptions, true);

    if (this.originalData) this.updateData(this.originalData);

    if (this.options.debugging) console.warn('PolygonChart: Debug mode is active');

  }

  masterDraw() {

    if (this.options.debugging) console.warn('PolygonChart: Drawing chart');

    if (this.options.animation && (this.options.animation.animated || this.options.animation.tween)) {

      this.animate();

    } else { this.draw(); }

  }

  setChartStyle() {

    if (this.options.style && this.options.style.chart) {

      const { fill, stroke, lineWidth } = this.options.style.chart;

      //set canvas style
      this.context.fillStyle = fill || 'rgba(0, 0, 0, 0)';
      this.context.strokeStyle = stroke || 'rgba(0, 0, 0, 1)';
      this.context.lineWidth = lineWidth || 1;

    }

  }

  setLabelStyle() {

    if (this.options?.style?.label) {

      const { fill, stroke, lineWidth } = this.options.style.label;

      const labelFont = `${this.options.style.label.fontSize * window.devicePixelRatio}px ${this.options.style.label.fontFamily}`;

      //set canvas style
      this.context.fillStyle = fill || 'rgba(0, 0, 0, 1)';
      this.context.strokeStyle = stroke || 'rgba(0, 0, 0, 1)';
      this.context.lineWidth = lineWidth || 1;
      this.context.font = labelFont;

    }

  }

  drawLabels() {

    this.context.save();

    this.setLabelStyle();

    for (let i = 0; i < this.labels.length; i++) {

      const currentAngle = this.angleStep * i;
      const transformAngle = currentAngle - (Math.PI / 2);

      const cosTransformAngle = Math.cos(transformAngle);
      const sinTransformAngle = Math.sin(transformAngle);

      let x = this.position.x + cosTransformAngle * this.radius;
      let y = this.position.y + sinTransformAngle * this.radius;

      if (currentAngle === 0) {

        this.context.textAlign = 'center';
        this.context.textBaseline = 'bottom';
        y -= this.labelMargin;

      } else if (currentAngle === Math.PI / 2) {

        this.context.textAlign = 'left';
        this.context.textBaseline = 'middle';
        x += this.labelMargin;

      } else if (currentAngle === Math.PI) {

        this.context.textAlign = 'center';
        this.context.textBaseline = 'top';
        y += this.labelMargin;

      } else if (currentAngle === (Math.PI / 2) * 3) {

        this.context.textAlign = 'right';
        this.context.textBaseline = 'middle';
        x -= this.labelMargin;

      } else {

        if (currentAngle < Math.PI) {

          this.context.textAlign = 'left';
          x += this.labelMargin;

          if (sinTransformAngle < 0) {
            this.context.textBaseline = 'bottom';
            y -= this.labelMargin;
          } else {
            this.context.textBaseline = 'top';
            y += this.labelMargin;
          }


        } else {

          this.context.textAlign = 'right';
          x -= this.labelMargin;

          if (sinTransformAngle < 0) {
            this.context.textBaseline = 'bottom';
            y -= this.labelMargin;
          } else {
            this.context.textBaseline = 'top';
            y += this.labelMargin;
          }


        }

      }

      this.context.fillText(this.labels[i], x, y);

      if (this.options.style?.label?.contour) this.context.strokeText(this.labels[i], x, y);

    }

    this.context.restore();

  }

  drawChart() {

    this.context.save();

    this.context.translate(this.position.x, this.position.y);

    this.context.rotate(-(Math.PI / 2));

    this.setChartStyle();

    if (this.options.style?.chart?.background) {
      this.context.beginPath();
      for (let j = 0; j < this.dataDimensions; j++) {
        const currentAngle = this.angleStep * j;
        this.context.lineTo(Math.cos(currentAngle) * (this.incrementStep * this.increments), Math.sin(currentAngle) * (this.incrementStep * this.increments));
      }
      this.context.closePath();
      this.context.fill();
    }

    //draw chart
    for (let i = 0; i <= this.increments; i++) {
      this.context.beginPath();
      for (let j = 0; j < this.dataDimensions; j++) {
        const currentAngle = this.angleStep * j;
        this.context.lineTo(Math.cos(currentAngle) * (this.incrementStep * i), Math.sin(currentAngle) * (this.incrementStep * i));
      }
      this.context.closePath();
      this.context.stroke();
    }

    //draw axis
    for (let i = 0; i < this.dataDimensions; i++) {
      const currentAngle = this.angleStep * i;
      this.context.moveTo(0, 0);
      this.context.lineTo(Math.cos(currentAngle) * this.radius, Math.sin(currentAngle) * this.radius);
    }
    this.context.stroke();

    this.context.restore();

    this.drawLabels();

  }

  draw(index: number | undefined = undefined, lastIndex: number | undefined = undefined) {

    this.context.save();

    this.clearCanvas();

    this.drawChart();

    this.context.translate(this.position.x, this.position.y);

    this.context.rotate(-(Math.PI / 2));

    if (Array.isArray(this.poly)) {

      if (index !== undefined) {

        if (lastIndex !== undefined) {

          for (let i = index; i <= lastIndex; i++) { this.poly[i].draw(this.context, this.angleStep, this.valueStep); }

        } else { this.poly[index].draw(this.context, this.angleStep, this.valueStep); }

      } else {

        for (let i = 0; i < this.data.length; i++) { this.poly[i].draw(this.context, this.angleStep, this.valueStep); }

      }

    } else { this.poly.draw(this.context, this.angleStep, this.valueStep); }

    this.context.restore();

  }

  basicAnimate() {

    this.context.save();

    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.drawChart();

    this.context.translate(this.position.x, this.position.y);

    this.context.rotate(-(Math.PI / 2));

    let complete = false;

    if (Array.isArray(this.poly)) {

      for (let i = 0; i < this.poly.length; i++) { this.poly[i].animate(this.context, this.angleStep, this.valueStep); }

      complete = this.poly.reduce((progress, currentPolygon) => {

        const polyProgress = currentPolygon.options.animation?.progress;

        if (polyProgress != 1) return progress;

        return progress + polyProgress;

      }, 0) === this.poly.length ? true : false;

    } else {

      this.poly.animate(this.context, this.angleStep, this.valueStep);

      if (this.poly.options.animation?.progress === 1) { complete = true; }

    }

    this.context.restore();

    if (complete) {

      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

      this.draw();

      window.cancelAnimationFrame(this.frameID);

      if (this.options && this.options.debugging) console.warn('PolygonChart: basic animation completed!');

    } else {

      this.frameID = window.requestAnimationFrame(this.basicAnimate.bind(this, this.context));

    }

  }

  //TODO: put the setTimeout return ID to good use
  tween(): number {

    if (!Array.isArray(this.poly)) throw new Error('PolyChart: I cannot tween a single polygon sorry );');

    this.context.save();

    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.drawChart();

    if (this.currentPolygon < 0) {

      this.currentPolygon = 0;

      return window.setTimeout(this.tween.bind(this), this.poly[this.currentPolygon].options.animation?.delay);

    }

    this.context.translate(this.position.x, this.position.y);

    this.context.rotate(-(Math.PI / 2));

    if (this.currentPolygon) {

      for (let i = 0; i < this.currentPolygon; i++) {
        this.poly[i].draw(this.context, this.angleStep, this.valueStep);
      }

    }

    const currentAnimationCompleted = this.poly[this.currentPolygon].animate(this.context, this.angleStep, this.valueStep);

    this.context.restore();

    if (currentAnimationCompleted) {

      let complete = this.poly.reduce((progress, currentPolygon) => {

        const polyProgress = currentPolygon.options.animation?.progress;

        if (polyProgress != 1) return progress;

        return progress + polyProgress;

      }, 0) === this.poly.length ? true : false;

      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

      this.draw(0, this.currentPolygon);

      window.cancelAnimationFrame(this.frameID);

      if (complete) {

        this.currentPolygon = -1;

        if (this.options && this.options.debugging) console.warn('PolygonChart: tweening completed!');

        return 0;

      } else {

        this.currentPolygon++;

      }

      if (this.poly[this.currentPolygon].options.animation) {

        return window.setTimeout(this.tween.bind(this), this.poly[this.currentPolygon].options.animation?.delay);

      }

      this.frameID = window.requestAnimationFrame(this.tween.bind(this, this.context));

    } else {

      this.frameID = window.requestAnimationFrame(this.tween.bind(this, this.context));

    }

    return 0;

  }

  //either animate all polygons at the same time or tween them based on supplied options
  animate() {

    if (Array.isArray(this.poly) && this.options.animation?.tween) {

      if (this.options && this.options.debugging) console.warn('PolygonChart: starting tweening');

      this.timeoutID = this.tween();

    } else {

      if (this.options && this.options.debugging) console.warn('PolygonChart: starting basic animation');

      this.basicAnimate();

    }

  }

  clearCanvas() { this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height); }

  resizeAndCenter() {

    const _that = this;

    const minDimension = Math.min(this.container.clientWidth, this.container.clientHeight);

    const pixelRatio = window.devicePixelRatio;

    this.canvas.style.height = this.canvas.style.width = `${minDimension + "px"}`;

    this.canvas.style.top = `${this.container.clientHeight / 2}px`;

    this.canvas.style.left = `${this.container.clientWidth / 2}px`;

    this.context.canvas.width = this.context.canvas.height = Math.floor(minDimension * pixelRatio);

    this.position = {
      x: _that.context.canvas.width / 2,
      y: _that.context.canvas.height / 2
    };

    this.radius = ((this.context.canvas.width / 2) - this.widestLabel) - this.labelMargin;

    this.incrementStep = this.radius / this.increments;

    this.valueStep = this.radius / this.maxValue;

    if (this.currentPolygon >= 0) {

      this.draw(0, this.currentPolygon - 1);

    } else { this.draw(); }

  }

}
