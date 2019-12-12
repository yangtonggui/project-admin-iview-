<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import './themes/index.scss';

#app {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  font-family: 'PingFang Medium';
  background: rgba(247, 248, 250, 1);
}
</style>
