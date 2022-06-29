<template>
  <div id="container" className="container"></div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
class TextGeometry extends THREE.ExtrudeGeometry {
  constructor(text, parameters) {
    const font = parameters.font;

    if (font === undefined) {
      super(); // generate default extrude geometry
    } else {
      const shapes = font.generateShapes(text, parameters.size);

      // translate parameters to ExtrudeGeometry API

      parameters.depth =
        parameters.height !== undefined ? parameters.height : 50;

      // defaults

      if (parameters.bevelThickness === undefined)
        parameters.bevelThickness = 10;
      if (parameters.bevelSize === undefined) parameters.bevelSize = 8;
      if (parameters.bevelEnabled === undefined)
        parameters.bevelEnabled = false;

      super(shapes, parameters);
    }

    this.type = 'TextGeometry';
  }
}
function createCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  return new THREE.Mesh(geometry, material);
}

function createText(text) {
  return new TextGeometry(text, {});
}

function init() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 4 / 2, 0.1, 100);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(400, 200);
  document.getElementById('container')?.appendChild(renderer.domElement);

  function addCube(cube) {
    scene.add(cube);
  }
  function renderMesh() {
    scene.children.forEach((cube) => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    });
  }

  function createLine(points: [number, number, number][]) {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map((item) => new THREE.Vector3(...item))
    );
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    return new THREE.Line(geometry, material);
  }

  function addLine(line) {
    scene.add(line);
  }
  function render() {
    renderer.render(scene, camera);
  }

  function loopRender() {
    renderMesh();
    requestAnimationFrame(loopRender);
    render();
  }

  function setCamera(x = 0, y = 0, z = 0) {
    camera.position.set(x, y, z);
  }

  return { addCube, setCamera, render, loopRender, createLine, addLine };
}

onMounted(() => {
  const instance = init();
  instance.addCube(createCube());
  instance.setCamera(0, 0, 5);
  instance.addLine(
    instance.createLine([
      [-2, 0, 0],
      [0, 2, 0],
      [2, 0, 0],
    ])
  );
  instance.render();
});
</script>
<style scope>
.container {
  width: 400px;
  height: 200px;
}
</style>
