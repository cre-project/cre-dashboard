<template>
  <nav class="navbar nav" role="navigation">
    <ul id="bottom" class="navbar-menu">
      <li class="navbar-item is-hoverable" v-for="route in r" :key="route.name">
        <router-link :to="route.path">{{ route.name.toUpperCase() }}</router-link>
      </li>
    </ul>
  </nav>
</template>
<script>
import { routes } from '@/router'

export default {
  computed: {
    r () {
      return routes.filter(route => route.meta && route.meta.isNav)
    }
  }
}
</script>

<style scoped>
#bottom {
  background-color: var(--medium-grey);
}
</style>
