<template>
  <div>
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
          </div>
        </div>

        <div class="float-right">
          <button
            class="save"
            type="submit"
            @click.prevent="save"
          >Save & Next</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { router } from './../router'
import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      property: {
        address: null,
        state: null,
        city: null,
        zip: null,
        numberOfStories: null,
        yearBuilt: null,
        lotSize: null,
        apn: null
      }
    }
  },
  computed: {
    ...mapGetters({ propertyByID: 'properties/byID', packageByID: 'packages/byID' }),
    pkg () {
      return this.packageByID(this.packageID)
    },
    packageID () {
      return this.$route.params.id
    }
  },
  methods: {
    async save () {
      try {
        if (!(this.pkg && this.pkg.property_id)) {
          // create new property if package that's being updated has no property yet
          await this.$store.dispatch('properties/create', { packageID: this.packageID, property: this.property })
        } else {
          // otherwise update the existing one
          await this.$store.dispatch('properties/update', this.property)
        }
        router.push(`/package/${this.packageID}/unit-mix`)
      } catch (err) {
        console.log(err.message)
        this.$toast.open({
          duration: 3500,
          message: 'Couldn\'t save property information',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    }
  },
  async created () {
    if (!this.pkg) {
      router.push('/dashboard')
      return
    }
    this.property = this.propertyByID(this.pkg.property_id) || {}
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
