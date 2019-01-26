<template>
  <div>
    <div class="cre-content">
      <div
        style="margin-right: 2em; margin-bottom: 3em;"
      >
        <h1 class="subtitle is-size-4 has-text-weight-semibold">List of Expenses</h1>
        <p class="subtitle">Edit, add, or remove expenses associated with this property.</p>
      </div>

      <b-table
        v-if="expenses.length > 0"
        :data="expenses"
        style="min-height: 20vh; width:95%; margin-left: 2em; margin-bottom: 4em;"
        class="m-t-5"
        hoverable
      >
        <template slot-scope="props">

          <b-table-column
            label="Expense"
            class="p-t-1-3"
            sortable
          >
            {{ props.row.label }}
          </b-table-column>

          <b-table-column
            class="p-t-1-3"
            label="Percentage"
            sortable
            centered
          >
            {{ props.row.percent ?  props.row.percent + '%' : '-' }}
          </b-table-column>

          <b-table-column
            class="p-t-1-3"
            label="Current Value"
            sortable
            centered
            numeric
          >
            {{ props.row.current_value }}
          </b-table-column>

          <b-table-column
            label="Pro Forma Value"
            class="p-t-1-3"
            sortable
            centered
            numeric
          >
            {{ props.row.potential_value }}
          </b-table-column>

          <b-table-column
            width="150"
            label="Edit"
            centered >
            <i
              class="material-icons"
              @click="edit(props.row)"
            >edit</i>
          </b-table-column>

          <b-table-column
            width="150"
            label="Delete"
            centered>
            <i
              class="material-icons"
              @click="remove(props.row)"
            >delete_forever</i>
          </b-table-column>
        </template>

      </b-table>

      <div v-else class="cre-content">
          <p class="subtitle">You have not added any expenses yet.</p>
      </div>

      <b-modal :active.sync="modalOpen" has-modal-card width="400">
          <expense-modal :packageID="packageID" :osID="os.id"/>
      </b-modal>

      <div class="spaced">
        <button
          class="save green"
          @click.prevent="modalOpen = true"
        >Add an expense</button>
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
import ExpenseModal from '@/components/ExpenseModal'
import { defaultExpenses } from '@/store/osFields'
import { router } from './../router'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      modalOpen: false,
      expenses: defaultExpenses
    }
  },

  components: {
    ExpenseModal
  },

  computed: {
    ...mapGetters({
      osByPackageID: 'os/byPackageID'
    }),

    packageID () {
      return this.$route.params.id
    },

    os () {
      return this.osByPackageID(this.packageID)
    }

  },

  methods: {
    async save () {
      try {
        await Promise.all(this.expenses.forEach(e => {
          if (!e.id) {
            // unsaved expense
            e.is_income = false
            this.$store.dispatch('os/addField', { expense: e, osID: this.os().id, packageID: this.packageID })
          }
        }))
        router.push(`/package/${this.$route.params.id}/operating-statement`)
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

    async remove (expense) {
      this.$dialog.confirm({
        title: 'Deleting Property Unit',
        message: 'You can\'t undo this action. Are you sure you want to proceed?',
        type: 'is-danger',
        hasIcon: true,
        confirmText: 'Delete',
        onConfirm: async () => {
          try {
            if (expense.id) {
              // TODO call API & delete
              // await this.$store.dispatch('propertyUnits/delete', { propertyID: this.property.id, id: unitID })
              console.log('deleted expense')
            } else {
              this.expenses = this.expenses.filter(e => e !== expense)
            }
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

    edit (row) {
      try {
        let vm = this
        this.$modal.open({
          parent: this,
          component: ExpenseModal,
          width: 400,
          props: {
            isEditing: !!row.id,
            expense: row,
            packageID: vm.packageID,
            osID: vm.os.id
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
      try {
        await this.$store.dispatch('os/fetchList', this.packageID)
        if (!this.os) {
          await this.$store.dispatch('os/create', this.packageID)
        }
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
