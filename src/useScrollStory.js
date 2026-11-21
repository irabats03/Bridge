import { useLayoutEffect, useRef } from 'react';
import { useMotion } from './MotionContext';

const clamp = value => Math.max(0, Math.min(value, 1));
const smooth = value => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const timelineEnd = 3.24; // Leave a short hold on the last chapter before the pin releases.

function setStyles(element, values) {
  for (const [name, value] of Object.entries(values)) {
    const next = value.toFixed(4);
    if (element.style.getPropertyValue(name) !== next) element.style.setProperty(name, next);
  }
}

export function useScrollStory(ref) {
  const { motion } = useMotion();
  const selectRef = useRef(null);

  useLayoutEffect(() => {
    if (!motion) return;

    const page = ref.current;
    const story = page.querySelector('.bridge-story');
    const runway = story.querySelector('.story-runway');
    const header = document.querySelector('.header');
    const copies = Array.from(story.querySelectorAll('.story-copy'));
    const visuals = Array.from(story.querySelectorAll('.story-visual'));
    const backdrops = Array.from(story.querySelectorAll('.story-backdrop'));
    const chapters = Array.from(story.querySelectorAll('.story-chapter'));
    const reveals = Array.from(page.querySelectorAll('[data-scroll-reveal]'));
    let frame = 0;
    let current = 0;
    let snapFrame = 0;
    let snapTimer;
    let gestureStart = null;
    let touchDown = false;

    function stopSnap() {
      clearTimeout(snapTimer);
      cancelAnimationFrame(snapFrame);
      snapFrame = 0;
      story.style.removeProperty('--deck-settle');
    }

    function geometry() {
      const y = window.scrollY;
      const start = y + story.getBoundingClientRect().top - header.offsetHeight;
      return { y, start, step: runway.offsetHeight / timelineEnd };
    }

    function springTo(target, from) {
      stopSnap();
      gestureStart = null;
      if (Math.abs(target - from) < 2) return;

      const started = performance.now();
      function advance(now) {
        const t = clamp((now - started) / 570);
        const travel = 1 - (1 - t) ** 4;
        const settle = Math.max(0, t - .42);
        const rebound = Math.sin(settle * Math.PI * 7) * Math.exp(-settle * 10);
        window.scrollTo({ top: from + (target - from) * travel, behavior: 'instant' });
        if (t < 1) {
          setStyles(story, { '--deck-settle': rebound });
          snapFrame = requestAnimationFrame(advance);
        } else {
          snapFrame = 0;
          story.style.removeProperty('--deck-settle');
        }
      }
      snapFrame = requestAnimationFrame(advance);
    }

    selectRef.current = index => {
      const { y, start, step } = geometry();
      if (step) springTo(Math.round(start + step * index), y);
    };

    function snapAfterGesture() {
      const origin = gestureStart;
      gestureStart = null;
      const { y, start, step } = geometry();
      const last = visuals.length - 1;
      if (origin === null || !step || y <= start || y >= start + step * last) return;

      const position = (y - start) / step;
      const beginning = (origin - start) / step;
      const nearest = Math.round(position);
      const direction = position - beginning;

      // A deliberate wheel tick advances the deck; a small nudge settles back.
      const fromRest = Math.abs(beginning - Math.round(beginning)) < .07;
      const chapter = fromRest && Math.abs(direction) > .17 && nearest === Math.round(beginning)
        ? Math.max(0, Math.min(last, nearest + Math.sign(direction)))
        : nearest;
      springTo(Math.round(start + step * chapter), y);
    }

    function queueSnap() {
      clearTimeout(snapTimer);
      if (gestureStart !== null && !touchDown) snapTimer = setTimeout(snapAfterGesture, 155);
    }

    function captureGesture() {
      stopSnap();
      gestureStart ??= window.scrollY;
      queueSnap();
    }

    function onScroll() {
      schedule();
      if (!snapFrame) queueSnap();
    }

    function onKey(event) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (event.key === 'Escape' || (event.key === 'Enter' && target instanceof Element && target.closest('a, button'))) {
        cancelInteraction();
        return;
      }
      if (target instanceof Element && target.closest('input, textarea, select, button, [contenteditable]')) return;
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) captureGesture();
    }

    function cancelInteraction() {
      gestureStart = null;
      stopSnap();
    }

    function startTouch() {
      touchDown = true;
      cancelInteraction();
    }

    function endTouch() {
      touchDown = false;
      queueSnap();
    }

    function paint() {
      frame = 0;
      const height = window.innerHeight;
      const distance = runway.offsetHeight;
      const timeline = distance
        ? Math.min(3, clamp((header.offsetHeight - story.getBoundingClientRect().top) / distance) * timelineEnd)
        : 0;
      const arrival = reveals.map(scene => clamp((height * 1.01 - scene.getBoundingClientRect().top) / (height * 0.29)));

      const front = Math.floor(timeline);
      const phase = timeline - front;
      const selected = Math.round(timeline);

      copies.forEach((copy, index) => {
        const shift = index - timeline;
        const delta = Math.abs(shift);
        setStyles(copy, { '--copy': smooth((.54 - delta) / .34), '--shift': shift });
        const order = (index - front + visuals.length) % visuals.length;
        const outgoing = order === 0 && phase > 0;
        // The front card arcs away, drops a layer, then rejoins the back of the deck.
        const depth = outgoing ? (visuals.length - 1) * smooth((phase - .23) / .77) : Math.max(0, order - phase);
        const swing = outgoing ? Math.sin(phase * Math.PI) : 0;
        const layer = outgoing && phase >= .53 ? 1 : visuals.length + 1 - order;
        setStyles(visuals[index], {
          '--deck-depth': depth,
          '--deck-swing': swing,
          '--deck-focus': Number(index === selected),
          '--enter': smooth((.85 - shift) / .93)
        });
        if (visuals[index].style.zIndex !== String(layer)) visuals[index].style.zIndex = layer;
        setStyles(backdrops[index], { '--backdrop': smooth(1 - delta) });
        setStyles(chapters[index], { '--chapter-progress': clamp(timeline - index + .12) });
      });

      if (selected !== current) {
        chapters[current].removeAttribute('aria-current');
        chapters[selected].setAttribute('aria-current', 'step');
        current = selected;
      }

      arrival.forEach((value, index) => setStyles(reveals[index], { '--arrival': value }));
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint);
    }

    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', captureGesture, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', cancelInteraction, { passive: true });
    window.addEventListener('touchstart', startTouch, { passive: true });
    window.addEventListener('touchmove', captureGesture, { passive: true });
    window.addEventListener('touchend', endTouch, { passive: true });
    window.addEventListener('touchcancel', endTouch, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    const resize = new ResizeObserver(schedule);
    resize.observe(page);

    return () => {
      selectRef.current = null;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', captureGesture);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', cancelInteraction);
      window.removeEventListener('touchstart', startTouch);
      window.removeEventListener('touchmove', captureGesture);
      window.removeEventListener('touchend', endTouch);
      window.removeEventListener('touchcancel', endTouch);
      stopSnap();
      window.removeEventListener('resize', schedule);
      resize.disconnect();
      cancelAnimationFrame(frame);
      chapters[current].removeAttribute('aria-current');
      chapters[0].setAttribute('aria-current', 'step');
      reveals.forEach(scene => scene.style.removeProperty('--arrival'));
    };
  }, [motion, ref]);

  return index => selectRef.current?.(index);
}
