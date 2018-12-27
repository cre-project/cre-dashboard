<template>
  <div class="full-page-centered">
    <slot />
  </div>
</template>

<style>
.full-page-centered {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}
</style>
