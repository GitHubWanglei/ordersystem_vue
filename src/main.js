import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import router from "./router";

let app = createApp(App);
app.component("ElementPlusIconsVue", ElementPlusIconsVue);
app.use(ElementPlus, { locale: zhCn });
app.use(router);
app.mount("#app");
