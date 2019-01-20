<template>
  <div>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-semibold auto-margin">Unit Mix</h1>
      <div
        class="float-right"
        style="margin-right: 2em; margin-bottom: 0;"
      >
        <b-field
          class="half-size"
          label="Total SqFt"
        >
          <b-input v-model.number="totalSqFt"></b-input>
        </b-field>
      </div>

      <table style="margin-left:5em;margin-top:2em;width:90%;margin-bottom:2em;">
        <thead>
          <tr>
            <th/>
            <th>Bedrooms</th>
            <th>Bathrooms</th>
            <th>Current Rent/Mo.</th>
            <th>Potential Rent/Mo.</th>
          </tr>
        </thead>

        <tbody>
          <!-- existing units -->
          <unit
            v-for="unit in units"
            :key="unit.id"
            :bedrooms.sync="unit.bedrooms"
            :bathrooms.sync="unit.bathrooms"
            :current_rent.sync="unit.current_rent"
            :potential_rent.sync="unit.potential_rent"
          />

          <!-- new unit placeholder -->
          <unit
            :class="isCreating ? '' : 'hidden'"
            :bedrooms.sync="bedrooms"
            :bathrooms.sync="bathrooms"
            :current_rent.sync="current_rent"
            :potential_rent.sync="potential_rent"
          />

          <!-- footer with summary -->
          <tr class="is-grey">
            <td>Total: {{ numUnits }} units</td>
            <td/>
            <td/>
            <td>{{ totalRentCurrent | money }}</td>
            <td>{{ totalRentPotential | money }}</td>
          </tr>
        </tbody>
      </table>

      <div class="spaced">
        <button
          class="save green"
          @click.prevent="addUnit"
        >Add Another Unit</button>
        <button
          class="save"
          type="submit"
          @click="save"
        >Save & Next</button>
      </div>
    </div>
  </div>
</template>
<script>
import Unit from '@/components/Unit';
import { router } from './../router';
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      totalSqFt: 0,
      isUpdating: false,
      isCreating: false,
      // properties for new unit
      bedrooms: null,
      bathrooms: null,
      current_rent: 0,
      potential_rent: 0
    }
  },

  components: {
    Unit: Unit
  },

  computed: {
    ...mapGetters({
      packageByID: 'packages/byID',
      propertyByPackageID: 'properties/byPackageID',
      propertyUnits: 'propertyUnits/listByPropertyID'
    }),

    property () {
      let pkg = this.packageByID(this.$route.params.id)
      return this.propertyByPackageID(pkg.id)
    },

    units () {
      return [
        { bedrooms: this.bedrooms,
          bathrooms: this.bathrooms,
          current_rent: this.current_rent,
          potential_rent: this.potential_rent,
          property_id: this.property.id }]
      // return this.propertyUnits(this.property.id) || []
    },

    numUnits () {
      return this.units.length || '# '
    },

    totalRentCurrent () {
      return this.units.reduce(
        (acc, unit) => acc + (Number(unit.currentRent) || 0),
        0
      )
    },

    totalRentPotential () {
      return this.units.reduce(
        (acc, unit) => acc + (Number(unit.potentialRent) || 0),
        0
      )
    }
  },
  methods: {
    // save potential unsaved unit and total sqft and proceed to next step
    async save () {
      try {
        if (this.isCreating) {
          this.saveUnit('create')
          this.isCreating = false
        } else if (this.isUpdating) {
          this.saveUnit('update')
          this.isUpdating = false
        }

        let prop = this.property
        if (prop.totalSqFt !== this.totalSqFt) {
          prop.totalSqFt = this.totalSqFt
          await this.$store.dispatch('properties/update', prop)
        }
        router.push(`/package/${this.$route.params.id}/sales-comparables`)
      } catch (err) {
        console.log(err.message)
        this.$toast.open({
          duration: 3500,
          message: 'Something went wrong, please try again or contact customer support',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    },

    addUnit () {
      if (this.isCreating) {
        this.saveUnit('create')
        this.isCreating = false
      } else if (this.isUpdating) {
        this.saveUnit('update')
        this.isUpdating = false
      } else {
        this.isCreating = true
      }
    },

    async saveUnit (method) {
      try {
        await this.$store.dispatch(`propertyUnits/${method}`, {
          bedrooms: this.bedrooms,
          bathrooms: this.bathrooms,
          current_rent: this.current_rent,
          potential_rent: this.potential_rent,
          property_id: this.property.id
        })

        // reset local data
        this.bedrooms = null
        this.bathrooms = null
        this.current_rent = null
        this.potential_rent = null
      } catch (err) {
        console.log(err)
        this.$toast.open({
          duration: 3500,
          message: 'Couldn\'t add a new comparable',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    }
  }
}
</script>
<style scoped>
.spaced {
  width: 90%;
  margin-left: 5em;
  margin-top: 4em;
  display: flex;
  justify-content: space-between;
}

.green {
  background-color: rgb(76, 175, 80); /* Green */
  color: white;
}
</style>
