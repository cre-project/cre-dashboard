<template>
  <div class="cre-content no-property">
    <div>
      <h1 class="subtitle is-size-4 has-text-weight-semibold">
        Please tell us something more about your property first
      </h1>
    </div>
    <div>
      <button
        class="save back"
        @click="goBack"  >
        Go to property information
      </button>
    </div>
  </div>
</template>

<script>
import { router } from './../router'

export default {
  methods: {
    goBack () {
      router.push(`/package/${this.$route.params.id}/property-info`)
    }
  }
}
</script>

<style scoped>
.no-property {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 15em;
}

.back {
  height: 4em;
  width: 17em;
  margin-top: 3em;
}
</style>
