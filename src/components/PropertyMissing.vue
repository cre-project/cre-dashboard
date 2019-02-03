<template>
  <div class="cre-content no-property">
    <div>
      <i class="material-icons" style="font-size: 75px;">flash_on</i>
      <h1 class="subtitle is-size-4 has-text-weight-semibold">
        We are all about lightning speed but first things first.<br>
        Before getting to this step please tell us a bit more about the property.
      </h1>
    </div>
    <div>
      <button
        class="save back"
        @click="goBack"  >
        Let's do it!
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
    text-align: center;
}

.back {
  height: 4em;
  width: 17em;
  margin-top: 3em;
}
</style>
