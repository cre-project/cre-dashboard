<template>
  <div>
    <navigation-header selected="property-info"></navigation-header>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-bold auto-margin">Property Information</h1>
      <div class="cre-inner-content">
        <div class="columns is-variable is-8">
          <div class="column">
            <h2 class="subtitle is-size-5 has-text-weight-bold">Property Address</h2>
            <form>
              <b-field label="Street">
                  <b-input v-model="property.address"></b-input>
              </b-field>

              <b-field label="State">
                  <b-input v-model="property.state"></b-input>
              </b-field>

              <b-field grouped>
                <b-field expanded label="City">
                    <b-input v-model="property.city"></b-input>
                </b-field>

                <b-field expanded label="ZIP">
                  <b-input v-model="property.zip"></b-input>
                </b-field>
              </b-field>
            </form>
          </div>

          <div class="column">
            <h2 class="subtitle is-size-5 has-text-weight-bold">Property Details</h2>
            <form>
              <b-field label="Number of Stories">
                  <b-input v-model="property.numberOfStories"></b-input>
              </b-field>

              <b-field label="Year built">
                  <b-input v-model="property.yearBuilt"></b-input>
              </b-field>

              <b-field grouped>
                <b-field expanded label="Lot Size Acres">
                  <b-input v-model="property.lotSize"></b-input>
                </b-field>

                <b-field expanded label="APN">
                  <b-input v-model="property.apn"></b-input>
                </b-field>
              </b-field>
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
