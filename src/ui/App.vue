<script setup lang="ts">
import { NetworkMessages } from '@common/network/messages';

async function ping() {
  const response = await NetworkMessages.PING.request({});
  console.log("Response:", response);
}

function createRect() {
  NetworkMessages.CREATE_RECT.send({
    width: 100,
    height: 100,
  })
}
</script>

<template>
  <div>
    <h1 class="section-title">Example Figma Plugin</h1>
    <button class="button button--primary" @click="ping">Ping</button>
    <button class="button button--primary" @click="createRect">Create Rect</button>
  </div>
</template>

<style scoped></style>
