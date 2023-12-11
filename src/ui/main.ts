import { initializeNetwork } from "@common/network/init";
import { NetworkMessages } from "@common/network/messages";
import { NetworkSide } from "@common/network/sides";
import '@ui/assets/reset.css'
import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import '@ui/assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'

initializeNetwork(NetworkSide.UI);

NetworkMessages.HELLO_PLUGIN.send({ text: "Hey there, Figma!" });

createApp(App).mount('#app')
