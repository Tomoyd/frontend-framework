import TWEEN from '@tweenjs/tween.js';
export function deleteItems<T>(res: T[], omits: T[]) {
  if (omits.length === 0) {
    return res;
  }

  const compare = (item: T) => {
    if (omits.length === 0) {
      return () => true;
    }
    const index = omits.indexOf(item);
    const omit = omits.splice(index, 1);
    return omit.length === 0;
  };
  return res.filter(compare);
}

function getAnimate() {
  let animateNumber = 0;
  return function animate(time: number) {
    animateNumber = requestAnimationFrame(animate);

    TWEEN.update(time);
    return () => {
      cancelAnimationFrame(animateNumber);
    };
  };
}

export function tweenAnimate<T extends object>(
  form: T,
  to: T,
  update: (p: T) => void,
  times = 1000
) {
  const stop = getAnimate()(0);
  const tween = new TWEEN.Tween(form);
  tween
    .to(to, times)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(update)
    .onComplete(() => {
      stop();
    })
    .start();
  return tween;
}
