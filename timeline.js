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
        duration: 600,
      },
    ],
  },
  {
    create: document => createSvgElement(document, 'circle', {
      cx: 50,
      cy: 5,
      r: 5,
      fill: 'white',
      stroke: 'red',
    }),
    frames: [
      {
        time: 0,
        duration: 100,
      },
      {
        time: 100,
        duration: 500,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: progress * 400,
          });
        },
      },
    ],
  },
];


function createAnimation(elements) {
  elements = elements.map(element => {
    const frames = element.frames.map(frame => {
      const duration = frame.duration || 0;
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

  const duration = elements.reduce((end, element) => (
    Math.max(end, element.end)
  ), 0);

  return {
    elements,
    duration,
  };
}

const animation = createAnimation(elements);

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

function update(time) {
  requestAnimationFrame(update);

  const timeDelta = time - lastTime;
  lastTime = time;

  for (let animation of animations) {
    if (animation.end >= time) {
      const animationTime = time - animation.start;
      console.log('animating');
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
    } else {
      for (let element of animation.elements) {
        if (element.dom) {
          svg.removeChild(element.dom);
          element.dom = null;
        }
      }
      animations.delete(animation);
    }
  }
}

requestAnimationFrame(update);


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

