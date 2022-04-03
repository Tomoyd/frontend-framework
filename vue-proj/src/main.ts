import { createApp } from 'vue';
import App from './App.vue';
import { translate } from './plugin';
import router from './router';

const app = createApp(App);

app.use(router);

app.use(translate, {
  greeting: {
    say: 'a i u e o',
  },
});

app.mount('#app');
