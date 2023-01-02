import type { RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/keep-alive',
    name: 'KeepAlive',
    component: () => import('../views/builtin/keepAlive/Index.vue'),
  },
  {
    path: '/attributes',
    name: 'attributes',
    component: () => import('../views/builtin/attributes/Index.vue'),
  },
  {
    path: '/slot',
    name: 'slot',
    component: () => import('../views/builtin/slot/Index.vue'),
  },
  {
    path: '/injection',
    name: 'injection',
    component: () => import('../views/builtin/injection/Index.vue'),
  },
  {
    path: '/async',
    name: 'async',
    component: () => import('../views/builtin/async/Index.vue'),
  },
];
export const builtinRoutes = routes.map((item) => {
  item.path = `/builtin${item.path}`;
  return item;
});
