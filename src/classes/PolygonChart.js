import { mergeObjects, createFittingCanvas, getLongestStringWidth, getMaxValueInArray } from '../helpers/utils.js';
import { Polygon } from './Polygon.js';
import easingFunctions from '../helpers/easingFunctions.js';

export class PolygonChart {

  //create a canvas and fit it to a given container element
  constructor(element) {

    [this.container, this.canvas, this.context] = createFittingCanvas(element);

  }

  //hook resize handlers to the window
  setResizeHandler() {

    if (this.options && this.options.debugging) console.log('PolygonChart.js: Hooking resize handlers to the window object');

    window.addEventListener('resize', this.resizeAndCenter.bind(this));

    return () => {

      if (this.options && this.options.debugging) console.log('PolygonChart.js: Unmounting chart and cleaning up event handlers');

      window.removeEventListener('resize', this.resizeAndCenter);

    }

  }

  updateData(newData) {

    if (this.options && this.options.debugging) console.log("PolygonChart.js: updating chart's data");

    const _that = this;

    try {

      if (Array.isArray(newData)) {

        this.labels = Object.keys(newData[0]);
        this.dataDimensions = this.labels.length;
        this.data = PolygonChart.extractDataFrom(newData);
        this.poly = [];
        this.currentPolygon = -1;

        for (let i = 0; i < this.data.length; i++) {

          const polygon = new Polygon(this.data[i], {

            animation: {
              animate: _that.options.animation.animated && _that.options.animation.animated.length ? _that.options.animation.animated[i] : (_that.options.animation.animated || _that.options.animation.tween),
              duration: _that.options.animation.duration.length ? _that.options.animation.duration[i] : _that.options.animation.duration,
              delay: _that.options.animation.delay.length ? _that.options.animation.delay[i] : _that.options.animation.delay,
              easingFunction: _that.options.animation.easingFunction.length && typeof _that.options.animation.easingFunction !== "string" ? easingFunctions[_that.options.animation.easingFunction[i]] : easingFunctions[_that.options.animation.easingFunction],
            },

            style: {
              contour: _that.options.style.polygon.contour.length ? _that.options.style.polygon.contour[i] : _that.options.style.polygon.contour,
              fill: _that.options.style.polygon.fill.length && typeof _that.options.style.polygon.fill !== "string" ? _that.options.style.polygon.fill[i] : _that.options.style.polygon.fill,
              stroke: _that.options.style.polygon.stroke.length && typeof _that.options.style.polygon.stroke !== "string" ? _that.options.style.polygon.stroke[i] : _that.options.style.polygon.stroke,
              lineWidth: _that.options.style.polygon.lineWidth.length ? _that.options.style.polygon.lineWidth[i] : _that.options.style.polygon.lineWidth
            }

          });

          this.poly.push(polygon);

        }

      } else if (newData.toString() === "[object Object]") {

        this.labels = Object.keys(newData);
        this.dataDimensions = this.labels.length;
        this.data = Object.values(newData);

        this.poly = new Polygon(this.data, {

          animation: {
            animate: _that.options.animation.animated,
            duration: _that.options.animation.duration,
            delay: _that.options.animation.delay,
            easingFunction: easingFunctions[_that.options.animation.easingFunction]
          },

          style: {
            contour: _that.options.style.polygon.contour,
            fill: _that.options.style.polygon.fill,
            stroke: _that.options.style.polygon.stroke,
            lineWidth: _that.options.style.polygon.lineWidth
          }

        });

      } else { throw new TypeError("The 'data' parameter can only be an array or an object"); }

    } catch (e) { console.error(e); }

    this.widestLabel = getLongestStringWidth(this.options.style.label.font, this.labels);

    this.position = {
      x: _that.context.canvas.width / 2,
      y: _that.context.canvas.height / 2
    };

    this.labelMargin = 5;
    this.radius = ((this.context.canvas.width / 2) - this.widestLabel) - this.labelMargin;
    this.increments = this.options.increments;
    this.incrementStep = this.radius / this.increments;
    this.angleStep = (Math.PI * 2) / this.dataDimensions;

    //data properties
    this.maxValue = this.options.maxValue ? this.options.maxValue : getMaxValueInArray(this.data);
    this.valueStep = this.radius / this.maxValue;

  }

  updateOptions(newOptions) {

    const _defaults = {

      debugging: false,

      maxValue: undefined,

      increments: 10,

      description: undefined,

      animation: {
        tween: false,
        animated: false,
        duration: 0,
        delay: 0,
        easingFunction: undefined,
        tween: false
      },

      style: {

        chart: {
          background: false,
          fill: 'rgba(0, 0, 255, 0.6)',
          stroke: 'rgba(0, 0, 0, 1)',
          lineWidth: 1
        },

        label: {
          contour: false,
          font: '1.6rem sans-serif',
          fill: 'rgba(0, 0, 0, 1)',
          stroke: 'rgba(255, 0, 0 , 1)',
          lineWidth: 0.2
        },

        polygon: {
          contour: true,
          fill: 'rgba(255, 0, 0, 0.4)',
          stroke: 'rgba(255, 0, 0, 1)',
          lineWidth: 2
        }

      }

    };

    this.options = this.options ? mergeObjects(this.options, newOptions, true) : mergeObjects(_defaults, newOptions, true);

    if (this.options.debugging) console.warn('PolygonChart.js: Debug mode is activated');

  }

  masterDraw() {

    if (this.options && this.options.debugging) console.log('PolygonChart.js: Drawing chart');

    if (this.options.animation.animated || this.options.animation.tween) {

      this.animate();

    } else { this.draw(); }

  }

  //extract and array of values from a supplied object (has to contain only numerical values)
  static extractDataFrom(array) {

    const data = [];

    for (let i = 0; i < array.length; i++) {
      data.push(Object.values(array[i]));
    }

    return data;

  }

  setChartStyle() {

    //set canvas style
    this.context.fillStyle = this.options.style.chart.fill;
    this.context.strokeStyle = this.options.style.chart.stroke;
    this.context.lineWidth = this.options.style.chart.lineWidth;

  }

  setLabelStyle() {

    //set canvas style
    this.context.fillStyle = this.options.style.label.fill;
    this.context.strokeStyle = this.options.style.label.stroke;
    this.context.lineWidth = this.options.style.label.lineWidth;
    this.context.font = this.options.style.label.font;

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

      if (this.options.style.label.contour) this.context.strokeText(this.labels[i], x, y);

    }

    this.context.restore();

  }

  drawChart() {

    this.context.save();

    this.context.translate(this.position.x, this.position.y);

    this.context.rotate(-(Math.PI / 2));

    this.setChartStyle();

    if (this.options.style.chart.background) {
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

    this.drawLabels(this.context);

  }

  draw(index = undefined, lastIndex = undefined) {

    this.context.save();

    this.clearCanvas();

    this.drawChart();

    this.context.translate(this.position.x, this.position.y);

    this.context.rotate(-(Math.PI / 2));

    if (this.poly.length) {

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

    this.drawChart(this.context);

    this.context.translate(this.position.x, this.position.y);

    this.context.rotate(-(Math.PI / 2));

    let complete = false;

    if (this.poly.length) {

      for (let i = 0; i < this.poly.length; i++) {

        if (this.poly[i].animated) {

          this.poly[i].draw(this.context, this.angleStep, this.valueStep);

        } else { this.poly[i].animate(this.context, this.angleStep, this.valueStep); }

      }

      complete = this.poly.reduce((progress, currentPolygon) => {

        return progress + currentPolygon.animationProgress;

      }, 0) === this.poly.length ? true : false;

    } else {

      this.poly.animate(this.context, this.angleStep, this.valueStep);

      if (this.poly.animationProgress === 1) { complete = true; }

    }

    this.context.restore();

    if (complete) {

      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

      this.draw();

      window.cancelAnimationFrame(this.frameID);

    } else {

      this.frameID = window.requestAnimationFrame(this.animate.bind(this, this.context));

    }

  }

  tween() {

    this.context.save();

    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.drawChart(this.context);

    if (this.currentPolygon < 0) {

      this.currentPolygon = 0;

      if (this.poly[this.currentPolygon].options.animation.delay > 0) {

        return window.setTimeout(this.tween.bind(this), this.poly[this.currentPolygon].options.animation.delay);

      }

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

        return progress + currentPolygon.animationProgress;

      }, 0) === this.poly.length ? true : false;

      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

      this.draw(0, this.currentPolygon);

      window.cancelAnimationFrame(this.frameID);

      if (complete) {

        this.currentPolygon = -1;

        return;

      } else {

        this.currentPolygon++;

      }

      if (this.poly[this.currentPolygon].options.animation.delay > 0) {

        return window.setTimeout(this.tween.bind(this), this.poly[this.currentPolygon].options.animation.delay);

      }

      this.frameID = window.requestAnimationFrame(this.tween.bind(this, this.context));

    } else {

      this.frameID = window.requestAnimationFrame(this.tween.bind(this, this.context));

    }

  }

  //either animate all polygons at the same time or tween them based on supplied options
  animate() {

    if (this.options.animation.tween) {

      this.tween();

    } else {

      this.basicAnimate();

    }

  }

  clearCanvas() { this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height); }

  pauseAnimation() { if (this.frameID) window.cancelAnimationFrame(this.frameID); }

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
