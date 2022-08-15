import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/store',
      name: 'store',
      component: () => import('../views/TestStore.vue'),
    },
    {
      path: '/v3',
      name: 'v3',
      component: () => import('../views/v3InProgress/V3View.vue'),
    },
    {
      path: '/kline',
      name: 'kLine',
      component: () => import('../views/charts/kLine/KLine.vue'),
    },
    {
      path: '/3d/base',
      name: '3d-base',
      component: () => import('../views/3D/Base.vue'),
    },
    {
      path: '/3d/panorama',
      name: '3d-panorama',
      component: () => import('../views/3D/Panorama.vue'),
    },

    {
      path: '/three/scene',
      name: 'scene',
      component: () => import('../views/three/SceneDemo.vue'),
    },
    {
      path: '/three/materials',
      name: 'materials',
      component: () => import('../views/three/MaterialsDemo.vue'),
    },
    {
      path: '/three/geometry',
      name: 'geometry',
      component: () => import('../views/three/GeometryDemo.vue'),
    },
    {
      path: '/three/sprite',
      name: 'sprite',
      component: () => import('../views/three/SpriteDemo.vue'),
    },
    {
      path: '/three/group',
      name: 'group',
      component: () => import('../views/three/GroupLoader.vue'),
    },
    {
      path: '/three/animation',
      name: 'animate',
      component: () => import('../views/three/AnimationCamera.vue'),
    },
  ],
});

export default router;
