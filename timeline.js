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
      cy: 10,
      r: 5,
      fill: 'white',
      stroke: color(0xff0000),
    }),
    frames: [
      {
        time: 0,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: 10,
          });
        },
      },
      {
        time: 500,
        duration: 500,
        update: (circle, progress) => {
          setAttributes(circle, {
            r: scale(ease(progress), 5, 0),
          });
        },
      },
      {
        time: 1000,
        duration: 500,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: 390,
            r: scale(ease(progress), 0, 5),
          });
        },
      },
      {
        time: 1500,
        duration: 300,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: 390,
            r: 5,
          });
        },
      },
    ],
  },
  {
    create: document => createSvgElement(document, 'circle', {
      cx: 50,
      cy: 390,
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
            cy: 390,
          });
        },
      },
      {
        time: 500,
        duration: 500,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: scale(ease(progress), 390, 200),
          });
        },
      },
      {
        time: 1000,
        duration: 500,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: 200,
            r: scale(ease(progress), 5, 10),
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
            r: scale(ease(progress), 10, 5),
            stroke: tweenColors(progress, color(0x00ff00), color(0xff0000)),
          });
        },
      },
      {
        time: 500,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: scale(ease(progress), 200, 5),
          });
        },
      },
      {
        time: 1000,
        update: (circle, progress) => {
          setAttributes(circle, {
            cy: 10,
          });
        },
      },
    ],
  },
  {
    create: document => createSvgElement(document, 'text', {
      x: 50,
      y: 205,
      'text-anchor': 'middle',
      color: 'green',
    }, '7'),
    frames: [
      {
        time: 0,
        duration: 500,
        update: (text, progress) => {
          text.textContent = '7';
          setAttributes(text, {
            opacity: 1 - progress,
          });
        },
      },
      {
        time: 1000,
        update: (text, progress) => {
          text.textContent = '30';
          setAttributes(text, {
            opacity: progress,
          });
        },
      },
      {
        time: 1500,
      },
    ],
  }
];

const animation = createAnimation(elements, {
  freeze: true,
});

requestAnimationFrame(update);

document.body.onclick = () => {
  animate(animation);
};

