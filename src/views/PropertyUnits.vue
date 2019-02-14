<template>
  <div>
    <property-missing v-if="!property.id && !isLoading"/>

    <div v-if="property.id && !isLoading" class="cre-content">
      <div
        class="spaced"
        style="margin-right: 2em; margin-bottom: 3em;"
      >
        <h1 class="subtitle is-size-4 has-text-weight-semibold">Unit Mix</h1>
        <b-field
          class="half-size"
          label="Total SqFt"
          :type="errors.has('totalSqFt') ? 'is-danger' : ''"
          :message="errors.has('totalSqFt') ? errors.first('totalSqFt') : ''"
        >
          <b-input
            input v-validate="'required|decimal:3'"
            v-model.number="totalSqFt"
            name="totalSqFt"
            separator=","
          />
        </b-field>
      </div>

      <b-table
        v-if="units.length > 0"
        :data="units"
        style="min-height: 20vh; width:95%; margin-left: 2em; margin-bottom: 4em;"
        class="m-t-5"
        hoverable
      >
        <template slot-scope="props">

          <b-table-column
            label="Bedrooms"
            class="p-t-1-3"
            width="150"
            sortable
            centered
            numeric
          >
            {{ props.row.bedrooms }}
          </b-table-column>

          <b-table-column
            class="p-t-1-3"
            label="Bathrooms"
            width="150"
            sortable
            centered
            numeric
          >
            {{ props.row.bathrooms }}
          </b-table-column>

          <b-table-column
            label="Current Rent"
            class="p-t-1-3"
            sortable
            centered
            numeric
          >
            {{ props.row.current_rent | money }}
          </b-table-column>

          <b-table-column
            label="Potential Rent"
            class="p-t-1-3"
            sortable
            centered
            numeric
          >
            {{ props.row.potential_rent | money }}
          </b-table-column>

          <b-table-column
            width="150"
            label="Edit"
            centered >
            <i
              class="material-icons"
              @click="edit(props.row.id)"
            >edit</i>
          </b-table-column>

          <b-table-column
            width="150"
            label="Delete"
            centered>
            <i
              class="material-icons"
              @click="remove(props.row.id)"
            >delete_forever</i>
          </b-table-column>
        </template>

        <template slot="footer">
          <th width="150" class="is-grey">
            <div class="is-centered th-wrap">Total: {{ numUnits }} units</div>
          </th>
          <th width="150" class="is-grey"/>
          <th class="is-grey">
            <div class="is-centered th-wrap"> {{ totalRentCurrent | money }} </div>
          </th>
          <th class="is-grey">
            <div class="is-centered th-wrap" > {{ totalRentPotential | money }} </div>
          </th>
          <th class="is-grey"/>
          <th class="is-grey"/>
        </template>
      </b-table>

      <div v-else class="cre-content">
          <p class="subtitle">You have not added any units to this property yet.</p>
      </div>

      <b-modal :active.sync="modalOpen" has-modal-card>
          <unit-modal :propertyID="property.id"/>
      </b-modal>

      <div class="spaced">
        <button
          class="save green"
          @click.prevent="modalOpen = true"
        >Add a unit</button>
        <button
          class="save"
          type="submit"
          @click="save"
        >Save & Next</button>
      </div>
    </div>
    <b-loading is-full-page="true" :active.sync="isLoading" :can-cancel="true"/>
  </div>
</template>
<script>
import UnitModal from '@/components/UnitModal'
import { router } from './../router'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      totalSqFt: 0,
      modalOpen: false,
      property: {},
      isLoading: true
    }
  },

  components: {
    UnitModal
  },

  computed: {
    ...mapGetters({
      packageByID: 'packages/byID',
      propertyByPackageID: 'properties/byPackageID',
      propertyUnits: 'propertyUnits/listByPropertyID',
      byID: 'propertyUnits/byID'
    }),

    packageID () {
      return this.$route.params.id
    },

    units () {
      return this.propertyUnits(this.property.id) || []
    },

    numUnits () {
      return this.units.length || '# '
    },

    totalRentCurrent () {
      return this.units.reduce(
        (acc, unit) => acc + (Number(unit.current_rent) || 0),
        0
      )
    },

    totalRentPotential () {
      return this.units.reduce(
        (acc, unit) => acc + (Number(unit.potential_rent) || 0),
        0
      )
    }
  },

  methods: {
    // save potential unsaved unit and total sqft and proceed to next step
    async save () {
      try {
        let valid = await this.$validator.validateAll()
        if (valid) {
          let prop = this.property
          if (prop.total_square_feet !== this.totalSqFt) {
            prop.total_square_feet = this.totalSqFt
            await this.$store.dispatch('properties/update', { property: prop })
          }
          router.push(`/package/${this.$route.params.id}/operating-statement`)
        }
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

    async remove (unitID) {
      this.$dialog.confirm({
        title: 'Deleting Property Unit',
        message: 'You can\'t undo this action. Are you sure you want to proceed?',
        type: 'is-danger',
        hasIcon: true,
        confirmText: 'Delete',
        onConfirm: async () => {
          try {
            await this.$store.dispatch('propertyUnits/delete', { propertyID: this.property.id, id: unitID })
          } catch (err) {
            this.$toast.open({
              duration: 3500,
              message: `Item could not be deleted: ${err.message}`,
              position: 'is-bottom',
              type: 'is-danger'
            })
          }
        }
      })
    },

    edit (unitID) {
      try {
        this.$modal.open({
          parent: this,
          component: UnitModal,
          props: {
            isEditing: true,
            unit: this.byID(unitID),
            propertyID: this.property.id
          }
        })
      } catch (err) {
        this.$toast.open({
          duration: 3500,
          message: 'Something went wrong, try again later or contact our customer support',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    }
  },

  async created () {
    if (!this.packageID || this.packageID === ':id') {
      router.push('/')
    } else {
      // load data
      try {
        await this.$store.dispatch('packages/fetchList')
        await this.$store.dispatch('properties/fetchList').then(() => {
          this.property = this.propertyByPackageID(this.packageID)
          if (this.property.id) {
            this.$store.dispatch('propertyUnits/fetchList', this.property.id)
          }
          this.totalSqFt = this.property.total_square_feet || 0
          this.isLoading = false
        })
      } catch (e) {
        console.log(e)
        router.push('/')
      }
    }
  }
}
</script>
<style scoped>
.spaced {
  display: flex;
  justify-content: space-between;
}

.green {
  background-color: rgb(76, 175, 80); /* Green */
  color: white;
}
</style>
