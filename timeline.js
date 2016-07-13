const elements = [
  {
    create: (document) => (
      createSvgElement(document, 'path', {
        d: 'M 50,5 L 50,395',
        stroke: 'brown',
      })
    ),
    frames: [
      {
        time: 0,
      },
    ],
  },
  {
    create: document => createSvgElement(document, 'circle', {
      cx: 50,
      cy: 5,
      r: 5,
      fill: 'white',
      stroke: color(0xff0000),
    }),
    frames: [
      {
        time: 0,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: 5,
          });
        },
      },
      {
        time: 500,
        duration: 500,
        update: (circle, progress) => {
          setAttributes(circle, {
            r: scale(progress, 5, 0),
          });
        },
      },
      {
        time: 1000,
        duration: 500,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: 395,
            r: scale(progress, 0, 5),
          });
        },
      },
      {
        time: 1500,
        duration: 300,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: 395,
            r: 5,
          });
        },
      },
    ],
  },
  {
    create: document => createSvgElement(document, 'circle', {
      cx: 50,
      cy: 395,
      r: 5,
      fill: 'white',
      stroke: color(0xff0000),
    }),
    frames: [
      {
        time: 0,
        update: (circle, progress) => {
          setAttributes(circle, {
            stroke: color(0xff0000),
            r: 5,
            cy: 395,
          });
        },
      },
      {
        time: 500,
        duration: 500,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: scale(progress, 395, 200),
          });
        },
      },
      {
        time: 1000,
        duration: 500,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: 200,
            r: scale(progress, 5, 10),
            stroke: tweenColors(progress, color(0xff0000), color(0x00ff00)),
          });
        },
      },
      {
        time: 1500,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: 200,
            r: 10,
            stroke: color(0x00ff00),
          });
        },
      }
    ],
  },
  {
    create: document => createSvgElement(document, 'circle', {
      cx: 50,
      cy: 200,
      r: 10,
      fill: 'white',
      stroke: 'green',
    }),
    frames: [
      {
        time: 0,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: 200,
            r: scale(progress, 10, 5),
            stroke: tweenColors(progress, color(0x00ff00), color(0xff0000)),
          });
        },
      },
      {
        time: 500,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: scale(progress, 200, 5),
          });
        },
      },
      {
        time: 1000,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: 5,
          });
        },
      },
    ],
  },
];


function createAnimation(elements, options) {
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

    return Object.assign({}, element, {
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

const animation = createAnimation(elements, {
  freeze: true,
});

const svg = document.getElementById('timeline');
let animations = new Set();

let lastTime = 0;
function animate(animation) {
  animation = Object.assign({}, animation, {
    start: lastTime,
    end: lastTime + animation.duration,
  });
  animations.add(animation);
}

function deanimate(animation) {
  for (let element of animation.elements) {
    if (element.dom) {
      svg.removeChild(element.dom);
      element.dom = null;
    }
  }
  animations.delete(animation);
}

function update(time) {
  requestAnimationFrame(update);

  const timeDelta = time - lastTime;
  lastTime = time;

  for (let animation of animations) {
    if (animation.end >= time) {
      const animationTime = time - animation.start;
      for (let element of animation.elements) {
        const frame = element.frames.find(frame => frame.time <= animationTime && frame.end >= animationTime);
        if (!frame && element.dom) {
          svg.removeChild(element.dom);
          element.dom = null;

        } else if (frame) {
          if (!element.dom) {
            element.dom = element.create(document);
            svg.appendChild(element.dom);
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

console.log(animation);

requestAnimationFrame(update);


function scale(val, from, to) {
  return val * (to - from) + from;
}

function setAttributes(element, attrs) {
  for (let key in attrs) {
    element.setAttribute(key, attrs[key]);
  }
}

function createSvgElement(document, tagname, attrs = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagname);
  setAttributes(element, attrs);
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
function color(r, g, b) {
  if (g === undefined && b === undefined) {
    const hex = Math.floor(r);
    r = hex >> 16 & 255;
    g = hex >> 8 & 255;
    b = hex & 255;
  }
  return Object.assign({}, basicColor, {r, g, b});
}

function tweenColors(progress, fromColor, toColor) {
  return (toColor.subtract(fromColor)).scale(progress).add(fromColor);
}


document.body.onclick = () => {
  animate(animation);
};

