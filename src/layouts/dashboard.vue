<template>
  <div>
    <main-header/>
    <slot/>
  </div>
</template>

<script>
import MainHeader from '@/components/MainHeader';

export default {
  components: {
    MainHeader
  }
};
</script>
