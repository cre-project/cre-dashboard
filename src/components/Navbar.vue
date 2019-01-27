<template>
  <nav class="navbar" role="navigation">
    <ul id="bottom" class="navbar-menu">
      <li class="navbar-item is-hoverable" v-for="r in routes" :key="r.name">
        <router-link :to="path(r.path)">{{ r.name.toUpperCase() }}</router-link>
      </li>
    </ul>
  </nav>
</template>
<script>
import { routes } from '@/router'

export default {
  computed: {
    routes () {
      return routes.filter(route => route.meta && route.meta.isNav)
    }
  },
  methods: {
    path (p) {
      if (this.$route.params.id) {
        return p.replace(':id', this.$route.params.id)
      }
      return p
    }
  }
}
</script>

<style scoped>
#bottom {
  background-color: var(--medium-grey);
}
</style>
