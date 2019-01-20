<template>
  <form>
      <div class="modal-card" style="width: 300">
          <header class="modal-card-head">
            <p class="modal-card-title title">Add a unit</p>
          </header>

        <section class="modal-card-body centered">
          <div class="columns" style="width: 100%; margin:1em;">
            <div class="column">
              <b-field label="Number of Bedrooms">
                <select class="buttonize down-arrow"
                  v-model="bedrooms">
                  <option disabled value="">Please select one</option>
                  <option>Studio</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </b-field>

              <b-field label="Number of Bathrooms">
                <select class="buttonize down-arrow"
                  v-model="bathrooms">
                  <option disabled value="">Please select one</option>
                  <option>1</option>
                  <option>1.5</option>
                  <option>2</option>
                  <option>2.5</option>
                  <option>3</option>
                </select>
              </b-field>
            </div>

            <div class="column">
              <b-field label="Current Rent">
                $ <vue-numeric
                  input
                  class="inline-edit"
                  separator=","
                  v-model="current_rent"/>
              </b-field>

              <b-field label="Potential Rent">
                $ <vue-numeric
                  input
                  class="inline-edit"
                  separator=","
                  v-model="potential_rent"/>
              </b-field>
            </div>
          </div>
        </section>

        <footer class="modal-card-foot spaced">
          <button class="button" type="button" @click="$parent.close()">Close</button>
          <button class="save green" @click.prevent="save">Save</button>
        </footer>
      </div>
  </form>
</template>

<script>
export default {
  props: {
    propertyID: {
      type: String
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    unit: {
      type: Object,
      default: null
    }
  },

  data: function () {
    return {
      bedrooms: '',
      bathrooms: '',
      current_rent: 0,
      potential_rent: 0
    }
  },

  methods: {
    async save () {
      try {
        const newUnit = {
          bedrooms: this.bedrooms,
          bathrooms: this.bathrooms,
          current_rent: this.current_rent,
          potential_rent: this.potential_rent
        }
        if (this.isEditing) {
          newUnit.id = this.unit.id
          // TODO no endpoint exists yet
          // await this.$store.dispatch('propertyUnits/update', { unit: newUnit, propertyID: this.propertyID })
        } else {
          await this.$store.dispatch('propertyUnits/create', { unit: newUnit, propertyID: this.propertyID })
        }
        this.$parent.close()
      } catch (err) {
        console.log(err.message)
        this.$toast.open({
          duration: 3500,
          message: 'Couldn\'t add a property unit',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    }
  },

  created () {
    if (this.unit) {
      this.bedrooms = this.unit.bedrooms
      this.bathrooms = this.unit.bathrooms
      this.current_rent = this.unit.current_rent
      this.potential_rent = this.unit.potential_rent
    }
  }
}
</script>
<style scoped>
.spaced {
  display: flex;
  justify-content: space-between
}
</style>
