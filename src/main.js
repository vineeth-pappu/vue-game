import Vue from 'vue'
// import App from './App.vue'
import Game from './Game2FinalWithAssets.vue'
import VueTouch from 'vue-touch';

Vue.use(VueTouch);

new Vue({
    el: '#app',
    render: h => h(Game)
})