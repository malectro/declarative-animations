const elements = [
  {
    create: (document) => (
      createSvgElement(document, 'rect', {
        x: 0,
        y: 0,
        width: 1080,
        height: 120,
        fill: 'url(#img2)',
        opacity: 0.2,
      })
    ),
    frames: [
      {
        time: 0,
        duration: 500,
        update: (rect, progress) => {
          setAttributes(rect, {
            x: scale(progress, 900, 0),
            opacity: 0.2,
          });
        },
      },
      {
        time: 500,
        duration: 500,
        update: (rect, progress) => {
          setAttributes(rect, {
            x: 0,
            opacity: scale(progress, 0.2, 1),
          });
        },
      },
      {
        time: 1000,
        update: (rect, progress) => {
          setAttributes(rect, {
            x: 0,
            opacity: 1,
          });
        },
      },
    ],
  },
  {
    create: (document) => (
      createSvgElement(document, 'rect', {
        x: 0,
        y: 0,
        width: 286,
        height: 120,
        fill: 'url(#img1)',
      })
    ),
    frames: [
      {
        time: 0,
        duration: 500,
        update: (rect, progress) => {
          setAttributes(rect, {
            x: scale(progress, 1080 - 286, 0),
          });
        },
      },
      {
        time: 500,
        update: (rect, progress) => {
          setAttributes(rect, {
            x: 0,
          });
        },
      }
    ],
  },
  {
    create: (document) => (
      createSvgElement(document, 'rect', {
        x: 281,
        y: 120,
        width: 1080 - 281,
        height: 0,
        fill: 'url(#img2)',
        opacity: 0.2,
      })
    ),
    frames: [
      {
        time: 1000,
        update: (rect, progress) => {
          setAttributes(rect, {
            height: scale(progress, 0, 300 - 120),
            opacity: 0.2,
          });
        },
      },
      {
        time: 1500,
        duration: 500,
        update: (rect, progress) => {
          setAttributes(rect, {
            height: 300 - 120,
            opacity: scale(progress, 0.2, 1),
          });
        },
      },
    ],
  },
];

const animation = createAnimation(elements, {
  freeze: true,
});

document.body.onclick = () => {
  animate(animation);
};

const svg = document.getElementById('viewport');

requestAnimationFrame(update);

