<template>
  <div>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-bold auto-margin">Property Information</h1>
      <div class="cre-inner-content">
        <div class="columns is-variable is-8">
          <div class="column is-two-fifths">
            <h2 class="subtitle is-size-5 has-text-weight-bold">Property Address</h2>
            <form>
              <b-field label="Street">
                  <b-input v-model="property.address.street"></b-input>
              </b-field>

              <b-field label="State">
                  <b-input v-model="property.address.state"></b-input>
              </b-field>

              <b-field grouped>
                <b-field expanded label="City">
                    <b-input v-model="property.address.city"></b-input>
                </b-field>

                <b-field expanded label="ZIP">
                  <b-input v-model="property.address.zip"></b-input>
                </b-field>
              </b-field>
            </form>
          </div>

          <div class="column">
            <h2 class="subtitle is-size-5 has-text-weight-bold">Property Details</h2>
            <form>
              <div class="columns">
                <div class="column">
                  <b-field label="Number of Stories">
                      <b-input v-model="property.number_of_stories"></b-input>
                  </b-field>

                  <b-field label="Year built">
                      <b-input v-model="property.year_built"></b-input>
                  </b-field>

                  <b-field expanded label="Lot Size Acres">
                    <b-input v-model="property.lot_size"></b-input>
                  </b-field>
                </div>

                <div class="column">
                  <b-field label="Price*">
                    <vue-numeric
                      input
                      currency="$"
                      separator=","
                      v-model="property.price"
                    ></vue-numeric>
                  </b-field>

                  <b-field expanded label="APN">
                    <b-input v-model="property.apn"></b-input>
                  </b-field>
                </div>
              </div>
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
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      property: {
        address: {
          street: null,
          city: null,
          state: null,
          zip: null
        },
        numberOfStories: null,
        yearBuilt: null,
        lotSize: null,
        apn: null
      }
    }
  },
  computed: {
    ...mapGetters({ propertyByPackageID: 'properties/byPackageID', packageByID: 'packages/byID' }),
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
        if (!this.property.package_id) {
          // create new property if it's not tied to a package yet
          let data = this.property
          data.package_id = this.packageID
          await this.$store.dispatch('properties/create', { property: data })
        } else {
          // otherwise update the existing one
          await this.$store.dispatch('properties/update', { property: this.property })
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
    if (!this.packageID || this.packageID === ':id') {
      router.push('/')
      return
    } else if (!this.pkg) {
      try {
        await this.$store.dispatch('packages/fetchList')
        await this.$store.dispatch('properties/fetchList')
      } catch (e) {
        console.log(e)
        router.push('/')
        return
      }
    }
    let prop = this.propertyByPackageID(this.packageID)
    this.property = prop || {
      address: {
        street: null,
        state: null,
        city: null,
        zip: null
      },
      numberOfStories: null,
      yearBuilt: null,
      lotSize: null,
      apn: null
    }
    if (!prop.address) {
      this.property.address = {
        street: null,
        state: null,
        city: null,
        zip: null
      }
    }
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
