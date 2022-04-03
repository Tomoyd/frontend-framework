import { createApp } from 'vue';
import App from './App.vue';
import { translate } from './plugin';
import router from './router';
import { pinia } from './store/piniaStore';

const app = createApp(App);
app.use(pinia);
app.use(router);

app.use(translate, {
  greeting: {
    say: 'a i u e o',
  },
});

app.mount('#app');
