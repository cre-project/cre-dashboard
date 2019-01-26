<template>
  <div>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-bold auto-margin">Property Information</h1>
      <div class="cre-inner-content">
        <div class="columns is-variable is-8">
          <div class="column is-two-fifths">
            <h2 class="subtitle is-size-5 has-text-weight-bold">Property Address</h2>
            <form>
              <b-field
                  :type="errors.has('street') ? 'is-danger' : ''"
                  :message="errors.has('street') ? errors.first('street') : ''"
                  label="Street"
                >
                    <b-input
                      v-validate="'required'"
                      v-model="property.address.street"
                      name="street"
                    />
              </b-field>

                <b-field
                  :type="errors.has('state') ? 'is-danger' : ''"
                  :message="errors.has('state') ? errors.first('state') : ''"
                  label="State"
                >
                    <b-input
                      v-validate="'required|alpha_spaces'"
                      v-model="property.address.state"
                      name="state"
                    />
              </b-field>

              <b-field grouped>
                <b-field
                  :type="errors.has('city') ? 'is-danger' : ''"
                  :message="errors.has('city') ? errors.first('city') : ''"
                  label="City"
                >
                    <b-input
                      v-validate="'required|alpha_spaces'"
                      v-model="property.address.city"
                      name="city"
                    />
                </b-field>

                <b-field
                  :type="errors.has('ZIP') ? 'is-danger' : ''"
                  :message="errors.has('ZIP') ? errors.first('ZIP') : ''"
                  expanded label="ZIP"
                >
                  <b-input
                    v-validate="'required|numeric'"
                    v-model="property.address.zip"
                    name="ZIP"
                  />
                </b-field>
              </b-field>
            </form>
          </div>

          <div class="column">
            <h2 class="subtitle is-size-5 has-text-weight-bold">Property Details</h2>
            <form>
              <div class="columns">
                <div class="column">
                  <b-field
                    :type="errors.has('number of stories') ? 'is-danger' : ''"
                    :message="errors.has('number of stories') ? errors.first('number of stories') : ''"
                    label="Number of Stories"
                  >
                    <b-input
                      v-validate="'between:0,100'"
                      v-model="property.numberOfStories"
                      name="number of stories"
                    />
                  </b-field>

                  <b-field
                    :type="errors.has('year built') ? 'is-danger' : ''"
                    :message="errors.has('year built') ? errors.first('year built') : ''"
                    label="Year built"
                  >
                    <b-input
                      input v-validate="'date_format:YYYY'"
                      v-model="property.year_built"
                      name="year built"
                    />
                  </b-field>

                  <b-field
                    :type="errors.has('lot size') ? 'is-danger' : ''"
                    :message="errors.has('lot size') ? errors.first('lot size') : ''"
                    label="Lot Size Acres"
                  >
                    <b-input
                      input v-validate="'decimal:3'"
                      v-model="property.lot_size"
                      name="lot size"
                    />
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

                  <b-field
                    :type="errors.has('APN') ? 'is-danger' : ''"
                    :message="errors.has('APN') ? errors.first('APN') : ''"
                    expanded label="APN"
                  >
                    <b-input
                      v-validate="'numeric'"
                      v-model="property.apn"
                      name="APN"
                    />
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
    if (!this.property.address) {
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
