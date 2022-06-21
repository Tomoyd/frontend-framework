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
      path: '/kLine',
      name: 'kLine',
      component: () => import('../views/charts/kLine/KLine.vue'),
    },
  ],
});

export default router;
