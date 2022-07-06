import { ref } from 'vue';
import { useWindowListener } from './useListener';

export const useCameraInteraction = () => {
  const position = ref({ lon: 0, lat: 0 });
  let isUserOperate = false;
  const mouse = { x: 0, y: 0 };
  let lon = 0;
  let lat = 0;
  let userStartLon = 0;
  let userStartLat = 0;
  let userStartX = 0;
  let userStartY = 0;
  useWindowListener(window, 'mousemove', (event) => {
    mouse.x = (event.pageX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.pageY / window.innerHeight) * 2 + 1;
    if (isUserOperate) {
      lon = (userStartX - event.pageX) * 0.1 + userStartLon;
      lat = (event.pageY - userStartY) * 0.1 + userStartLat;
      position.value = { lon, lat };
    }
  });
  useWindowListener(window, 'mousedown', (ev) => {
    isUserOperate = true;
    userStartX = ev.pageX;
    userStartY = ev.pageY;
    userStartLat = lat;
    userStartLon = lon;
  });

  useWindowListener(window, 'mouseup', () => {
    isUserOperate = false;
  });

  return position;
};
