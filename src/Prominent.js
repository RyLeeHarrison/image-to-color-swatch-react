import React from 'react';

const sigbits = 5;
const rshift = 8 - sigbits;
const maxIterations = 1000;
const fractByPopulations = 0.75;

const getColorIndex = (r, g, b) => (r << (2 * sigbits)) + (g << sigbits) + b;

class PV {
  static map(array, f) {
    const o = Object.of(null)
    return f ? array.map((d, i) => {
      o.index = i;
      return f.call(o, d);
    }) : array.slice();
  }

  static naturalOrder(a, b) {
    return (a < b) ? -1 : ((a > b) ? 1 : 0);
  }

  static sum(array, f) {
    const o = Object.of(null)
    return array.reduce(f ? (p, d, i) => {
      o.index = i;
      return p + f.call(o, d);
    } : (p, d) => p + d, 0);
  }

  static max(array, f) {
    return Math.max.apply(null, f ? PV.map(array, f) : array);
  }
}

class PQueue {
  constructor(comparator) {
    this.comparator = comparator;
    this.contents = [];
    this.sorted = false;
  }

  sort() {
    this.contents.sort(this.comparator);
    this.sorted = true;
  }

  push(o) {
    this.contents.push(o);
    this.sorted = false;
  }

  peek(index) {
    if (!this.sorted) this.sort();
    if (index === undefined) {
      index = this.contents.length - 1;
    }

    return this.contents[index];
  }

  pop() {
    if (!this.sorted) this.sort();
    return this.contents.pop();
  }

  size() {
    return this.contents.length;
  }

  map(f) {
    return this.contents.map(f);
  }

  debug() {
    if (!this.sorted) this.sort();
    return this.contents;
  }
}

class VBox {
  constructor(r1, r2, g1, g2, b1, b2, histo) {
    this.r1 = r1;
    this.r2 = r2;
    this.g1 = g1;
    this.g2 = g2;
    this.b1 = b1;
    this.b2 = b2;
    this.histo = histo;
  }

  volume(force) {
    if (!this._volume || force) {
      this._volume = (
        (this.r2 - this.r1 + 1) *
        (this.g2 - this.g1 + 1) *
        (this.b2 - this.b1 + 1)
      );
    }

    return this._volume;
  }

  count(force) {
    if (!this._count_set || force) {
      let npix = 0;
      let i;
      let j;
      let k;
      let index;

      for (i = this.r1; i <= this.r2; i++) {
        for (j = this.g1; j <= this.g2; j++) {
          for (k = this.b1; k <= this.b2; k++) {
            index = getColorIndex(i, j, k);
            npix += (this.histo[index] || 0);
          }
        }
      }
    
      this._count = npix;
      this._count_set = true;
    }

    return this._count;
  }

  copy() {
    return new VBox(
      this.r1, this.r2,
      this.g1, this.g2,
      this.b1, this.b2,
      this.histo
    )
  }

  avg(force) {
    if (!this._avg || force) {
      let ntot = 0;
      const mult = 1 << (8 - sigbits);
      let rsum = 0;
      let gsum = 0;
      let bsum = 0;
      let hval;
      let i;
      let j;
      let k;
      let histoindex;

      for (i = this.r1; i <= this.r2; i++) {
        for (j = this.g1; j <= this.g2; j++) {
          for (k = this.b1; k <= this.b2; k++) {
            histoindex = getColorIndex(i, j, k);
            hval = this.histo[histoindex] || 0;
            ntot += hval;
            rsum += (hval * (i + 0.5) * mult);
            gsum += (hval * (j + 0.5) * mult);
            bsum += (hval * (k + 0.5) * mult);
          }
        }
      }

      if (ntot) {
        this._avg = [
          ~~(rsum / ntot),
          ~~(gsum / ntot),
          ~~(bsum / ntot)
        ];
      } else {
        this._avg = [
          ~(mult * (this.r1 + this.r2 + 1) / 2),
          ~~(mult * (this.g1 + this.g2 + 1) / 2),
          ~~(mult * (this.b1 + this.b2 + 1) / 2)
        ];
      }
    }

    return this._avg;
  }

  contains(pixel) {
    let gval;
    let bval;

    const rval = pixel[0] >> rshift;

    gval = pixel[1] >> rshift;
    bval = pixel[2] >> rshift;

    return (
      rval >= this.r1
      && rval <= this.r2
      && gval >= this.g1
      && gval <= this.g2
      && bval >= this.b1
      && bval <= this.b2
    );
  }
}

class CMap {
  constructor() {
    this.vboxes = new PQueue((vbox1, vbox2) => PV
      .naturalOrder(
        vbox1.count() * vbox1.volume(),
        vbox2.count() * vbox2.volume()
      ));
  }

  push(vbox) {
    this.vboxes.push({
      vbox,
      color: vbox.avg()
    })
  }

  palette() {
    return this.vboxes.map(({
      color
    }) => color);
  }

  size() {
    return this.vboxes.size();
  }

  map(color) {
    for (let i = 0; i < this.vboxes.size(); i++) {
      if (this.vboxes.peek(i).vbox.contains(color)) {
        return this.vboxes.peek(i).color;
      }
    }

    return this.nearest(color);
  }

  nearest(color) {
    let d1;
    let d2;
    let pColor;

    for (let i = 0; i < this.vboxes.size(); i++) {
      d2 = Math.sqrt(
        (color[0] - this.vboxes.peek(i).color[0]) ** 2 +
        (color[1] - this.vboxes.peek(i).color[1]) ** 2 +
        (color[2] - this.vboxes.peek(i).color[2]) ** 2
      );
      if (d2 < d1 || d1 === undefined) {
        d1 = d2;
        pColor = this.vboxes.peek(i).color;
      }
    }

    return pColor;
  }

  forcebw() {
    this.vboxes.sort(({
      color1
    }, {
      color2
    }) => PV.naturalOrder(
      PV.sum(color1),
      PV.sum(color2)
    ));

    const lowest = this.vboxes[0].color;

    if (lowest[0] < 5 && lowest[1] < 5 && lowest[2] < 5) {
      this.vboxes[0].color = [0, 0, 0];
    }

    const idx = this.vboxes.length - 1;
    const highest = this.vboxes[idx].color;

    if (highest[0] > 251 && highest[1] > 251 && highest[2] > 251) {
      this.vboxes[idx].color = [255, 255, 255];
    }
  }
}

const getHisto = (pixels) => {
  const histosize = 1 << (3 * sigbits);
  const histo = new Array(histosize);
  let index;
  let rval;
  let gval;
  let bval;

  pixels.forEach(pixel => {
    rval = pixel[0] >> rshift;
    gval = pixel[1] >> rshift;
    bval = pixel[2] >> rshift;
    index = getColorIndex(rval, gval, bval);
    histo[index] = (histo[index] || 0) + 1;
  });

  return histo;
}

const vboxFromPixels = (pixels, histo) => {
  let rmin = 1000000;
  let rmax = 0;
  let gmin = 1000000;
  let gmax = 0;
  let bmin = 1000000;
  let bmax = 0;
  let rval;
  let gval;
  let bval;

  pixels.forEach(pixel => {
    rval = pixel[0] >> rshift;
    gval = pixel[1] >> rshift;
    bval = pixel[2] >> rshift;
    if (rval < rmin) rmin = rval;
    else if (rval > rmax) rmax = rval;
    if (gval < gmin) gmin = gval;
    else if (gval > gmax) gmax = gval;
    if (bval < bmin) bmin = bval;
    else if (bval > bmax) bmax = bval;
  });

  return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo);
}

const medianCutApply = (histo, vbox) => {
  if (!vbox.count()) return;

  const rw = vbox.r2 - vbox.r1 + 1;
  const gw = vbox.g2 - vbox.g1 + 1;
  const bw = vbox.b2 - vbox.b1 + 1;
  const maxw = PV.max([rw, gw, bw]);

  if (vbox.count() === 1) return [vbox.copy()]

  let total = 0;

  const partialsum = [];
  const lookaheadsum = [];
  let i;
  let j;
  let k;
  let sum;
  let index;

  if (maxw === rw) {
    for (i = vbox.r1; i <= vbox.r2; i++) {
      sum = 0;
      for (j = vbox.g1; j <= vbox.g2; j++) {
        for (k = vbox.b1; k <= vbox.b2; k++) {
          index = getColorIndex(i, j, k);
          sum += (histo[index] || 0);
        }
      }
      total += sum;
      partialsum[i] = total;
    }
  } else if (maxw === gw) {
    for (i = vbox.g1; i <= vbox.g2; i++) {
      sum = 0;
      for (j = vbox.r1; j <= vbox.r2; j++) {
        for (k = vbox.b1; k <= vbox.b2; k++) {
          index = getColorIndex(j, i, k);
          sum += (histo[index] || 0);
        }
      }
      total += sum;
      partialsum[i] = total;
    }
  } else {
    for (i = vbox.b1; i <= vbox.b2; i++) {
      sum = 0;
      for (j = vbox.r1; j <= vbox.r2; j++) {
        for (k = vbox.g1; k <= vbox.g2; k++) {
          index = getColorIndex(j, k, i);
          sum += (histo[index] || 0);
        }
      }
      total += sum;
      partialsum[i] = total;
    }
  }

  partialsum.forEach((d, i) => {
    lookaheadsum[i] = total - d
  });

  const doCut = (color) => {
    const dim1 = `${color}1`;
    const dim2 = `${color}2`;
    let left;
    let right;
    let vbox1;
    let vbox2;
    let d2;
    let count2 = 0;

    for (i = vbox[dim1]; i <= vbox[dim2]; i++) {
      if (partialsum[i] > total / 2) {
        vbox1 = vbox.copy();
        vbox2 = vbox.copy();

        left = i - vbox[dim1];
        right = vbox[dim2] - i;
        
        if (left <= right) {
          d2 = Math.min(vbox[dim2] - 1, ~~(i + right / 2));
        } else {
          d2 = Math.max(vbox[dim1], ~~(i - 1 - left / 2));
        }

        while (!partialsum[d2]) d2++;
        count2 = lookaheadsum[d2];
        while (!count2 && partialsum[d2 - 1]) count2 = lookaheadsum[--d2];
        vbox1[dim2] = d2;
        vbox2[dim1] = vbox1[dim2] + 1;
        return [vbox1, vbox2];
      }
    }
  }

  return (maxw === rw)
    ? doCut('r')
    : (maxw === gw)
      ? doCut('g')
      : doCut('b')
}

const quantize = (pixels, maxcolors) => {
  if (!pixels.length || maxcolors < 2 || maxcolors > 256) {
    return false;
  }

  const histo = getHisto(pixels);
  
  let nColors = 0;
  histo.forEach(() => nColors++);

  if (nColors <= maxcolors) {

  }

  const pq = new PQueue((a, b) => PV.naturalOrder(a.count(), b.count()));
  pq.push(vboxFromPixels(pixels, histo));

  const iter = (lh, target) => {
    let ncolors = 1;
    let niters = 0;
    let vbox;

    while (niters < maxIterations) {
      vbox = lh.pop();
      if (!vbox.count()) {
        lh.push(vbox);
        niters++;
        continue;
      }

      const vboxes = medianCutApply(histo, vbox);

      const vbox1 = vboxes[0];
      const vbox2 = vboxes[1];

      if (!vbox1) {
        return;
      }

      lh.push(vbox1);

      if (vbox2) {
        lh.push(vbox2);
        ncolors++;
      }

      if (ncolors >= target) return;

      if (niters++ > maxIterations) {
        return;
      }
    }
  }

  iter(pq, fractByPopulations * maxcolors);

  const pq2 = new PQueue((a, b) => PV.naturalOrder(
    a.count() * a.volume(),
    b.count() * b.volume()
  ));

  while (pq.size()) {
    pq2.push(pq.pop());
  }

  iter(pq2, maxcolors - pq2.size());

  const cmap = new CMap();

  while (pq2.size()) {
    cmap.push(pq2.pop());
  }

  return cmap;
}


class Swatch {
  constructor(rgb, population) {
    this.hsl = undefined
    this.yiq = 0
    this.rgb = rgb;
    this.population = population;
  }
  
  getHsl() {
    if (!this.hsl) {
      return this.hsl = Dynamic.rgbToHsl(this.rgb[0], this.rgb[1], this.rgb[2]);
    } else {
      return this.hsl;
    }
  }

  getPopulation() {
    return this.population;
  }

  getRgb() {
    return this.rgb;
  }

  getHex() {
    return `#${((1 << 24) + (this.rgb[0] << 16) + (this.rgb[1] << 8) + this.rgb[2]).toString(16).slice(1, 7)}`;
  }

  getTitleTextColor() {
    this._ensureTextColors();
    if (this.yiq < 200) {
      return "#fff";
    } else {
      return "#000";
    }
  }

  getBodyTextColor() {
    this._ensureTextColors();
    if (this.yiq < 150) {
      return "#fff";
    } else {
      return "#000";
    }
  }

  _ensureTextColors() {
    if (!this.yiq) {
      return this.yiq = ((this.rgb[0] * 299) + (this.rgb[1] * 587) + (this.rgb[2] * 114)) / 1000;
    }
  }
}

class CanvasImage {
  constructor(image) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    this.width = (this.canvas.width = image.width);
    this.height = (this.canvas.height = image.height);
    
    this.context.drawImage(image, 0, 0, this.width, this.height);
  }

  clear() {
    return this.context.clearRect(0, 0, this.width, this.height);
  }

  update(imageData) {
    return this.context.putImageData(imageData, 0, 0);
  }

  getPixelCount() {
    return this.width * this.height
  }

  getImageData() {
    return this.context.getImageData(0, 0, this.width, this.height)
  }

  removeCanvas() {
    return this.canvas.parentNode.removeChild(this.canvas)
  }
}


class Dynamic {
  constructor(sourceImage, colorCount, quality) {
    this.TARGET_DARK_LUMA = 0.26;
    this.MAX_DARK_LUMA = 0.45;
    this.MIN_LIGHT_LUMA = 0.55;
    this.TARGET_LIGHT_LUMA = 0.74;

    this.MIN_NORMAL_LUMA = 0.3;
    this.TARGET_NORMAL_LUMA = 0.5;
    this.MAX_NORMAL_LUMA = 0.7;

    this.TARGET_MUTED_SATURATION = 0.3;
    this.MAX_MUTED_SATURATION = 0.4;

    this.TARGET_VIBRANT_SATURATION = 1;
    this.MIN_VIBRANT_SATURATION = 0.35;

    this.WEIGHT_SATURATION = 3;
    this.WEIGHT_LUMA = 6;
    this.WEIGHT_POPULATION = 1;

    this.DynamicSwatch = undefined;
    this.MutedSwatch = undefined;
    this.DarkDynamicSwatch = undefined;
    this.DarkMutedSwatch = undefined;
    this.LightDynamicSwatch = undefined;
    this.LightMutedSwatch = undefined;

    this.HighestPopulation = 0;

    if (typeof colorCount === 'undefined') colorCount = 64;
    if (typeof quality === 'undefined') quality = 5;
    
    const image = new CanvasImage(sourceImage);

    try {
      const imageData = image.getImageData();
      const pixels = imageData.data;
      const pixelCount = image.getPixelCount();

      const allPixels = [];
      let i = 0;
      while (i < pixelCount) {
        const offset = i * 4;
        const r = pixels[offset + 0];
        const g = pixels[offset + 1];
        const b = pixels[offset + 2];
        const a = pixels[offset + 3];

        if (a >= 125) {
          if (!((r > 250) && (g > 250) && (b > 250))) {
            allPixels.push([r, g, b]);
          }
        }

        i = i + quality;
      }

      const cmap = quantize(allPixels, colorCount);
      this._swatches = cmap.vboxes.map(vbox => new Swatch(vbox.color, vbox.vbox.count()));
      this.maxPopulation = this.findMaxPopulation;
      this.generateVarationColors();
      this.generateEmptySwatches();
    } finally {
      image.removeCanvas();
    }
  }

  generateVarationColors() {
    this.DynamicSwatch = this.findColorVariation(
      this.TARGET_NORMAL_LUMA,
      this.MIN_NORMAL_LUMA,
      this.MAX_NORMAL_LUMA,
      this.TARGET_VIBRANT_SATURATION,
      this.MIN_VIBRANT_SATURATION,
      1
    );

    this.LightDynamicSwatch = this.findColorVariation(
      this.TARGET_LIGHT_LUMA,
      this.MIN_LIGHT_LUMA,
      1,
      this.TARGET_VIBRANT_SATURATION,
      this.MIN_VIBRANT_SATURATION,
      1
    );

    this.DarkDynamicSwatch = this.findColorVariation(
      this.TARGET_DARK_LUMA,
      0,
      this.MAX_DARK_LUMA,
      this.TARGET_VIBRANT_SATURATION,
      this.MIN_VIBRANT_SATURATION,
      1
    );
    
    this.MutedSwatch = this.findColorVariation(
      this.TARGET_NORMAL_LUMA,
      this.MIN_NORMAL_LUMA,
      this.MAX_NORMAL_LUMA,
      this.TARGET_MUTED_SATURATION,
      0,
      this.MAX_MUTED_SATURATION
    );
    
    this.LightMutedSwatch = this.findColorVariation(
      this.TARGET_LIGHT_LUMA,
      this.MIN_LIGHT_LUMA,
      1,
      this.TARGET_MUTED_SATURATION,
      0,
      this.MAX_MUTED_SATURATION
    );

    return this.DarkMutedSwatch = this.findColorVariation(
      this.TARGET_DARK_LUMA,
      0,
      this.MAX_DARK_LUMA,
      this.TARGET_MUTED_SATURATION,
      0,
      this.MAX_MUTED_SATURATION
    );
  }

  generateEmptySwatches() {
    let hsl;
    if (this.DynamicSwatch === undefined) {
      if (this.DarkDynamicSwatch !== undefined) {
        hsl = this.DarkDynamicSwatch.getHsl();
        hsl[2] = this.TARGET_NORMAL_LUMA;
        this.DynamicSwatch = new Swatch(Dynamic.hslToRgb(hsl[0], hsl[1], hsl[2]), 0);
      }
    }

    if (this.DarkDynamicSwatch === undefined) {
      if (this.DynamicSwatch !== undefined) {
        hsl = this.DynamicSwatch.getHsl();
        hsl[2] = this.TARGET_DARK_LUMA;
        return this.DarkDynamicSwatch = new Swatch(Dynamic.hslToRgb(hsl[0], hsl[1], hsl[2]), 0);
      }
    }
  }

  findMaxPopulation() {
    let population = 0;

    for (let swatch of Array.from(this._swatches)) {
      population = Math.max(population, swatch.getPopulation());
    }

    return population;
  }

  findColorVariation(targetLuma, minLuma, maxLuma, targetSaturation, minSaturation, maxSaturation) {
    let max = undefined;
    let maxValue = 0;

    for (let swatch of Array.from(this._swatches)) {
      const sat = swatch.getHsl()[1];
      const luma = swatch.getHsl()[2];

      if ((sat >= minSaturation) && (sat <= maxSaturation) &&
        (luma >= minLuma) && (luma <= maxLuma) &&
        !this.isAlreadySelected(swatch)) {
        const value = this.createComparisonValue(sat, targetSaturation, luma, targetLuma,
          swatch.getPopulation(), this.HighestPopulation);
        if ((max === undefined) || (value > maxValue)) {
          max = swatch;
          maxValue = value;
        }
      }
    }

    return max;
  }

  createComparisonValue(saturation, targetSaturation, luma, targetLuma, population, maxPopulation) {
    return this.weightedMean(
      this.invertDiff(saturation, targetSaturation), this.WEIGHT_SATURATION,
      this.invertDiff(luma, targetLuma), this.WEIGHT_LUMA,
      population / maxPopulation, this.WEIGHT_POPULATION
    );
  }

  invertDiff(value, targetValue) {
    return 1 - Math.abs(value - targetValue);
  }

  weightedMean(...values) {
    let sum = 0;
    let sumWeight = 0;
    let i = 0;
    while (i < values.length) {
      const value = values[i];
      const weight = values[i + 1];
      sum += value * weight;
      sumWeight += weight;
      i += 2;
    }
    return sum / sumWeight;
  }

  swatches() {
    return Object.entries({
      vibrant: this.DynamicSwatch,
      muted: this.MutedSwatch,
      darkDynamic: this.DarkDynamicSwatch,
      darkMuted: this.DarkMutedSwatch,
      lightDynamic: this.LightDynamicSwatch,
      lightMuted: this.LightMuted
    })
    .filter(([name, value]) => ((value !== null) && (value !== undefined)))
    .map(([name, value]) => [name, value])
  }


  isAlreadySelected(swatch) {
    return (this.DynamicSwatch === swatch) || (this.DarkDynamicSwatch === swatch) ||
      (this.LightDynamicSwatch === swatch) || (this.MutedSwatch === swatch) ||
      (this.DarkMutedSwatch === swatch) || (this.LightMutedSwatch === swatch);
  }

  static rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = undefined;
    let s = undefined;

    const l = (max + min) / 2;

    if (max === min) {
      h = (s = 0);
    } else {
      const d = max - min;

      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d) + (g < b ? 6 : 0); break;
        case g: h = ((b - r) / d) + 2; break;
        case b: h = ((r - g) / d) + 4; break;
        default: break;
      }

      h /= 6;
    }

    return [h, s, l];
  }

  static hslToRgb(h, s, l) {
    let r = undefined;
    let g = undefined;
    let b = undefined;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < (1 / 6)) return p + ((q - p) * 6 * t);
      if (t < (1 / 2)) return q;
      if (t < (2 / 3)) return p + ((q - p) * ((2 / 3) - t) * 6);

      return p;
    };

    if (s === 0) {
      r = (g = (b = l));
    } else {
      const q = l < 0.5 ? l * (1 + s) : (l + s) - (l * s);
      const p = (2 * l) - q;
      r = hue2rgb(p, q, h + (1 / 3));
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - (1 / 3));
    }

    return [
      r * 255,
      g * 255,
      b * 255
    ];
  }
};

export default class extends React.Component {
  state = {
    swatches: undefined
  }

  componentDidMount() {
    const src = this.props.image
    this._originalSrc = src;
    this._img = new Image();
    this._img.onload = this.onload;
    this._img.onerror = this.onerror;
    this._img.crossOrigin = true;
    this._img.src = src;
  }

  onerror = () => {}
  
  onload = () => {
    const vibrant = new Dynamic(this._img);
    const swatches = vibrant.swatches();

    this.setState({
      swatches
    })
  }

  render() {
    const {render, children, image} = this.props
    const {swatches} = this.state

    return (
      <React.Fragment>
        {((typeof children === 'function') && swatches)
          ? children
            ? children({swatches, image})
            : children
          : render
            ? render({swatches, image})
            : render
        }
      </React.Fragment>
    )
  }
}