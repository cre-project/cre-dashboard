<template>
  <div>
    <navigation-header selected="property-info"></navigation-header>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-bold auto-margin">Property Information</h1>
      <div class="block">
        <div class="columns">
          <div class="column">
            <h2 class="subtitle is-size-5 has-text-weight-bold">Property Address</h2>
            <form>
              <label>
                <div>Street</div>
                <input v-model="property.address">
              </label>
              <label>
                <div>State</div>
                <input v-model="property.state">
              </label>
              <div>
                <label class="half-size">
                  <div class="half-size">City</div>
                  <input
                    class="half-size"
                    v-model="property.city"
                  >
                </label>
                <label class="half-size">
                  <div class="half-size">ZIP</div>
                  <input
                    class="half-size"
                    v-model="property.zip"
                  >
                </label>
              </div>
            </form>
          </div>

          <div class="column">
            <h2 class="subtitle is-size-5 has-text-weight-bold">Property Details</h2>
            <form>
              <div>
                <label>
                  <div>Number of Stories</div>
                  <input v-model="property.numberOfStories">
                </label>
                <label>
                  <div>Year built</div>
                  <input v-model="property.yearBuilt">
                </label>
              </div>
              <div>
                <label>
                  <div>Lot Size Acres</div>
                  <vue-numeric
                    input
                    separator=","
                    v-model="property.lotSize"
                  ></vue-numeric>
                </label>
                <label>
                  <div>APN</div>
                  <input v-model="property.apn">
                </label>
              </div>
            </form>
            <button
              class="save m-t-2"
              style="margin-left:18em;"
              id="property-info"
              type="submit"
              @click="save"
            >Save & Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { mapActions } from 'vuex'
import { router } from './../router'

export default {
  data () {
    return {
      property: {}
    }
  },
  methods: {
    //     ...mapActions('valuations', ['setProperty', 'persist']),
    save () {
      //       this.setProperty(this.property)
      //       this.persist()
      router.push(`/package/${this.$route.params.id}/operating-statement`)
      //       router.push('./unit-mix')
    }
    //   },
    //   created () {
    //     // fill up the local property object
    //     this.property = this.$store.state.valuations.selectedValuation.property
    //     eb.$on('newValuation', () => {
    //       this.property = Object.assign({}, emptyProperty)
    //     })
  }
}
</script>
<style>
h1 {
  width: unset;
}
h2 {
  margin-left: 0;
  margin-bottom: 2em;
}
</style>
