<template>
  <div id="app">
    <component :is="layout" class="light-grey">
      <router-view/>
    </component>
  </div>
</template>

<script>
export default {
  computed: {
    layout () {
      return `${(this.$route.meta.layout || 'default')}-layout`
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../main.css";

  #app {
    height: 100vh;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .light-grey {
    background-color: var(--light-grey);
  }
</style>
