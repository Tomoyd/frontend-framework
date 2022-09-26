import type { RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/keep-alive',
    name: 'KeepAlive',
    component: () => import('../views/builtin/KeepAlive/Index.vue'),
  },
];
export const builtinRoutes = routes.map((item) => {
  item.path = `/builtin${item.path}`;
  return item;
});
