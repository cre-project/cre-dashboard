<template>
  <div style="overflow: hidden; width: 100vw;">
    <iframe
      v-if="selectedPlan && selectedPlan === 'great'"
      src="https://payments.pabbly.com/subscribe/5c164cdf1d8f824f9a8cc82e/great-plan-jan-2019"
      width="100%"
      height="900"
    > </iframe>

    <iframe
      v-else-if="selectedPlan === 'better'"
      src="https://payments.pabbly.com/subscribe/5c164d881d8f824f9a8cc830/better-plan-jan-2019"
      width="100%"
      height="900"
    > </iframe>
    <iframe
      v-else
      src="https://payments.pabbly.com/subscribe/5c1bbc8a2abc0f049777ded6/trial"
      width="100%"
      height="900"
    > </iframe>
  </div>
</template>
<script>
export default {
  data () {
    return {
      selectedPlan: null
    }
  },
  created () {
    this.selectedPlan = this.$route.params.plan
  }
}
</script>
