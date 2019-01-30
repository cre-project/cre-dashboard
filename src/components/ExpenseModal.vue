<template>
  <form>
      <div class="modal-card" style="width: auto;">
          <header class="modal-card-head">
            <p class="modal-card-title title">{{ isEditing || (expense && expense.label) ? 'Edit' : 'Add' }} an expense</p>
          </header>

        <section class="modal-card-body" style="padding-left: 3em;">
          <div>
            <b-field label="Expense">
              <input
                input
                v-model="name"/>
            </b-field>

            <b-field label="Current Value">
              $ <vue-numeric
                input
                separator=","
                v-model="current_value"/>
            </b-field>

            <b-field label="Potential Value">
              $ <vue-numeric
                input
                separator=","
                v-model="potential_value"/>
            </b-field>
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
    packageID: {
      type: String
    },
    osID: {
      type: String
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    expense: {
      type: Object,
      default: null
    }
  },

  data: function () {
    return {
      name: '',
      current_value: 0,
      potential_value: 0
    }
  },

  methods: {
    async save () {
      try {
        let newExpense = {
          current_value: this.current_value,
          potential_value: this.potential_value,
          name: this.name,
          is_income: false
        }
        if (this.isEditing) {
          newExpense.id = this.expense.id
          await this.$store.dispatch('os/updateField', { field: newExpense, packageID: this.packageID, osID: this.osID })
        } else {
          newExpense = await this.$store.dispatch('os/addField', { field: newExpense, packageID: this.packageID, osID: this.osID })
          this.$emit('expenseAdded', newExpense)
        }
        this.$parent.close()
      } catch (err) {
        console.log(err.message)
        this.$toast.open({
          duration: 3500,
          message: 'Couldn\'t add an expense',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    }
  },

  created () {
    if (this.expense) {
      this.name = this.expense.name
      this.current_value = this.expense.current_value
      this.potential_value = this.expense.potential_value
    }
  }
}
</script>
