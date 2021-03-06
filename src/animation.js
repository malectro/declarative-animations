import BezierEasing from 'bezier-easing';


const noop = () => {};

export function createAnimation(elements, options) {
  const duration = elements.reduce((end, {frames}) => (
    Math.max(end,
      frames.reduce((max, {time, duration}) => Math.max(max, time + (duration || 0)), 0)
    )
  ), 0);
  const theEnd = duration;

  elements = elements.map(element => {
    const frames = element.frames.map((frame, i) => {
      const nextFrame = element.frames[i + 1];

      let {duration} = frame;
      if (duration === undefined) {
        if (nextFrame) {
          duration = nextFrame.time - frame.time;
        } else {
          duration = theEnd - frame.time;
        }
      }
      const end = frame.time + duration;

      return Object.assign({}, frame, {
        duration,
        end,
      });
    });

    const start = frames.reduce((min, {time}) => Math.min(min, time), Infinity);
    const end = frames.reduce((max, {end}) => Math.max(max, end), 0);

    return Object.assign({
      create: noop,
      destroy: noop,
    }, element, {
      frames,
      start,
      end,
    });
  });

  return Object.assign({}, options, {
    elements,
    duration,
  });
}

let animations = new Set();

let lastTime = 0;
export function animate(animation) {
  animation = Object.assign({}, animation, {
    start: lastTime,
    end: lastTime + animation.duration,
  });
  animations.add(animation);
}

export function deanimate(animation) {
  for (let element of animation.elements) {
    if (element.dom) {
      element.destroy(element.dom);
      element.dom = null;
    }
  }
  animations.delete(animation);
}

export function update(time) {
  requestAnimationFrame(update);

  const timeDelta = time - lastTime;
  lastTime = time;

  for (let animation of animations) {
    if (animation.end >= time) {
      const animationTime = time - animation.start;
      for (let element of animation.elements) {
        const frame = element.frames.find(frame => frame.time <= animationTime && frame.end >= animationTime);
        if (!frame && element.dom) {
          element.destroy(element.dom);
          element.dom = null;

        } else if (frame) {
          if (!element.dom) {
            element.dom = element.create(document);
          }

          if (frame.update) {
            const progress = (animationTime - frame.time) / frame.duration;
            frame.update(element.dom, progress);
          }
        }
      }
    } else if (!animation.freeze) {
      deanimate(animation);
    }
  }
}

export function scale(val, from, to) {
  return val * (to - from) + from;
}

export function constrain(val, from, to = 1) {
  if (val <= from) {
    return 0;
  }
  if (val >= to) {
    return 1;
  }
  return (val - from) / (to - from);
}

export function setAttributes(element, attrs) {
  for (let key in attrs) {
    element.setAttribute(key, attrs[key]);
  }
}

export function createSvgElement(document, tagname, attrs = {}, content) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagname);
  setAttributes(element, attrs);
  if (content) {
    element.textContent = content;
  }
  return element;
}

const basicColor = {
  r: 0, g: 0, b: 0,

  toString() {
    const {r, g, b} = this;
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  },

  add(color) {
    const {r, g, b} = this;
    return Object.assign({}, this, {
      r: r + color.r,
      g: g + color.g,
      b: b + color.b,
    });
  },

  subtract(color) {
    const {r, g, b} = this;
    return Object.assign({}, this, {
      r: r - color.r,
      g: g - color.g,
      b: b - color.b,
    });
  },

  scale(value) {
    const {r, g, b} = this;
    return Object.assign({}, this, {
      r: r * value,
      g: g * value,
      b: b * value,
    });
  },
};
export function color(r, g, b) {
  if (g === undefined && b === undefined) {
    const hex = Math.floor(r);
    r = hex >> 16 & 255;
    g = hex >> 8 & 255;
    b = hex & 255;
  }
  return Object.assign({}, basicColor, {r, g, b});
}

export function tweenColors(progress, fromColor, toColor) {
  return (toColor.subtract(fromColor)).scale(progress).add(fromColor);
}

export const easeIn = BezierEasing(0.42, 0, 1, 1);
export const easeOut = BezierEasing(0, 0, 0.58, 1);
export const easeInOut = BezierEasing(0.42, 0, 0.58, 1);
export const ease = BezierEasing(0.25, 0.1, 0.25, 1);

