<template>
  <div>
    <property-missing v-if="!property.id"/>

    <div v-else class="cre-content">
      <div class="columns">

        <div class="column is-two-thirds">
          <h1 class="subtitle is-size-4 has-text-weight-bold auto-margin">Operating Statement</h1>

            <!-- INCOME TABLE -->
            <table class="os">
              <thead>
                <tr class="is-grey is-size-6">
                  <th
                    class="sub-section l-align bolder"
                    colspan="2"
                  >Income</th>
                  <th class="sub-section">Current</th>
                  <th class="sub-section">Pro Forma</th>
                  <th/>
                </tr>
              </thead>
              <tr>
                <td
                  class="l-align bold"
                  colspan="2"
                >GROSS POTENTIAL RENT</td>
                <td>{{ currentGrossRent | money }}</td>
                <td>{{ potentialGrossRent | money }}</td>
                <td/>
              </tr>
              <tr>
                <td>Less: Vacancy/Deduction</td>
                <td class="setting">
                  <button
                    class="percent"
                    @click="decrease('vacancy')"
                  >-</button>
                    <span class="percent-value">{{ os.vacancy || 0 }}%</span>
                  <button
                    class="percent"
                    @click="increase('vacancy')"
                  >+</button>
                </td>
                <td>
                  -
                  <span id="vacancy-current">{{ currentVacancy | money }}</span>
                </td>
                <td>
                  -
                  <span id="vacancy-future">{{ potentialVacancy | money }}</span>
                </td>
                <td/>
              </tr>
              <tr>
                <td
                  class="l-align bold"
                  colspan="2"
                >EFFECTIVE RENTAL INCOME</td>
                <td>{{ currentEffectiveRent | money }}</td>
                <td>{{ potentialEffectiveRent | money }}</td>
                <td/>
              </tr>

              <!-- custom income line items -->
              <line-item
                v-for="(income, index) in incomes"
                :item="income"
                :key="'i' + index"
                @deleted="deletedIncome"
              />

              <tr>
                <td
                  class="l-align bold"
                  colspan="2"
                >EFFECTIVE GROSS INCOME</td>
                <td>{{ effectiveGrossIncome | money }}</td>
                <td>{{ potentialGrossIncome | money }}</td>
                <td></td>
              </tr>

              <tr/>

              <tr class="is-grey is-size-6">
                <th
                  class="sub-section l-align bolder"
                  colspan="2"
                >Expenses</th>
                <th class="sub-section">Current</th>
                <th class="sub-section">Pro Forma</th>
                <th/>
              </tr>

              <!-- OS expense fields - taxes & mgmt fee -->
              <tr>
                <td class="l-align" colspan="2">
                  <div class="double-input">
                    <input
                      style="width: 45%; margin-right: 2em;"
                      class="input is-small"
                      :value="os.taxes_label"
                    >
                    <vue-numeric
                      input
                      style="width: 30%;"
                      class="input is-small "
                      :precision="4"
                      currency="%"
                      currency-symbol-position="suffix"
                      v-model.number="os.taxes"
                      :minus="false"
                    />
                  </div>
                </td>
                <td><p>{{ taxes | money }}</p></td>
                <td><p>{{ taxes | money }}</p></td>
                <td/>
              </tr>

              <tr>
                <td>
                  <input
                    style="width: 45%; margin-right: 2em;"
                    class="input is-small"
                    :value="os.mgmt_fee_label"
                  >
                </td>
                <td class="setting">
                  <button
                    class="percent"
                    @click="decrease('mgmt_fee')"
                  >-</button>
                    <span class="percent-value">{{ os.mgmt_fee || 0 }}%</span>
                  <button
                    class="percent"
                    @click="increase('mgmt_fee')"
                  >+</button>
                </td>
                <td><p>{{ currentMgmtFee | money }}</p></td>
                <td><p>{{ potentialMgmtFee | money }}</p></td>
                <td/>
              </tr>

              <!-- Expense line items -->
              <line-item
                v-for="(expense, index) in expenses"
                :item="expense"
                :key="index"
                @deleted="deleted"
              />

              <tr>
                <td colspan="3"/>
                <td>Add Expense Item</td>
                <td>
                  <i class="material-icons icon is-small clickable"
                    @click.prevent="modalOpen = true"
                  >add_circle</i>
                </td>
              </tr>

              <tr/>

              <tr class="is-grey">
                <td
                  class="l-align bold"
                  colspan="2"
                >TOTAL EXPENSES</td>
                <td>{{ totalExpensesCurrent | money }}</td>
                <td>{{ totalExpensesPotential | money }}</td>
                <td></td>
              </tr>

              <!-- effective gross income minus total expenses -->
              <tr>
                <td
                  class="l-align bold"
                  colspan="2"
                >Net Operating Income</td>
                <td class="bold">{{ currentNetOperatingIncome | money }}</td>
                <td class="bold">{{ potentialNetOperatingIncome | money }}</td>
                <td></td>
              </tr>
            </table>

            <b-modal :active.sync="modalOpen" has-modal-card width="400">
                <expense-modal
                  :packageID="packageID"
                  :osID="os.id"
                  @expenseAdded="newExpenseAdded"
                />
            </b-modal>

            <div class="centered m-t-3">
              <button
                class="save"
                type="submit"
                @click="save"
              >Save & Next</button>
            </div>
        </div>
        <side-form
          class="column"
          :stats="stats"
          :property="property"
          :numUnits="propertyUnits.length"
        ></side-form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { router } from './../router'
import SideForm from '@/components/SideForm'
import LineItem from '@/components/OSLineItem'
import ExpenseModal from '@/components/ExpenseModal'

export default {
  data () {
    return {
      incomes: [],
      expenses: [],
      modalOpen: false,
      hasSaved: false
    }
  },

  components: {
    SideForm,
    LineItem,
    ExpenseModal
  },

  computed: {
    ...mapGetters({
      osByPackageID: 'os/byPackageID',
      osExpenses: 'os/expenses',
      osIncomes: 'os/incomes',
      propertyByPackageID: 'properties/byPackageID',
      unitsByPropertyID: 'propertyUnits/listByPropertyID'
    }),

    packageID () {
      return this.$route.params.id
    },

    os () {
      return this.osByPackageID(this.packageID)
    },

    property () {
      return this.propertyByPackageID(this.packageID)
    },

    propertyUnits () {
      if (this.property && this.property.id) {
        return this.unitsByPropertyID(this.property.id) || []
      }
      return []
    },

    vacancy () {
      return this.os.vacancy || 0
    },

    otherIncome () {
      return this.incomes[0] || { current_value: 0, potential_value: 0 }
    },

    /** CALCULATED VALUES */
    currentGrossRent () {
      return this.propertyUnits.reduce((acc, unit) => acc + (unit.current_rent || 0), 0) * 12
    },

    potentialGrossRent () {
      return this.propertyUnits.reduce((acc, unit) => acc + (unit.potential_rent || 0), 0) * 12
    },

    currentVacancy () {
      return (this.currentGrossRent / 100) * this.vacancy
    },

    potentialVacancy () {
      return (this.potentialGrossRent / 100) * this.vacancy
    },

    // actual income coming from rent
    currentEffectiveRent () {
      return this.currentGrossRent - this.currentVacancy
    },

    potentialEffectiveRent () {
      return this.potentialGrossRent - this.potentialVacancy
    },

    // effective rental income + other income
    effectiveGrossIncome () {
      return this.currentEffectiveRent + this.otherIncome.current_value
    },

    potentialGrossIncome () {
      return this.potentialEffectiveRent + this.otherIncome.potential_value
    },

    /** CALCULATIONS BASED ON OS CALCULATED VALUES & OS DATA */
    currentMgmtFee () {
      if (this.os.mgmt_fee && this.os.mgmt_fee !== 0) {
        return (this.effectiveGrossIncome || 0 / 100) * this.os.mgmt_fee
      }
      return 0
    },

    potentialMgmtFee () {
      if (this.os.mgmt_fee && this.os.mgmt_fee !== 0) {
        return ((this.potentialGrossIncome || 0) / 100) * this.os.mgmt_fee
      }
      return 0
    },

    taxes () {
      return ((this.property.price || 0) / 100) * (this.os.taxes || 0)
    },

    /* TOTAL expenses & incomes */
    totalExpensesCurrent () {
      return this.sum('current_value') + this.currentMgmtFee
    },

    totalExpensesPotential () {
      return this.sum('potential_value') + this.potentialMgmtFee
    },

    currentNetOperatingIncome () {
      return this.effectiveGrossIncome - this.totalExpensesCurrent
    },

    potentialNetOperatingIncome () {
      return this.potentialGrossIncome - this.totalExpensesPotential
    },

    // stats for side form
    stats () {
      let currentCapRate, potentialCapRate, currentGrm, potentialGrm
      if (!this.property.price) {
        currentCapRate = 'n/a'
        potentialCapRate = 'n/a'
      } else {
        currentCapRate = ((this.currentNetOperatingIncome / this.property.price) * 100).toFixed(2) + '%'
        potentialCapRate = ((this.potentialNetOperatingIncome / this.property.price) * 100).toFixed(2) + '%'
      }

      // GRM = gross rent multiplier
      if (!this.currentGrossRent) {
        currentGrm = 'n/a'
      } else {
        currentGrm = (this.property.price / this.currentGrossRent).toFixed(2)
      }

      if (!this.potentialGrossRent) {
        potentialGrm = 'n/a'
      } else {
        potentialGrm = (this.property.price / this.potentialGrossRent).toFixed(2)
      }

      return {
        currentCapRate: currentCapRate,
        potentialCapRate: potentialCapRate,
        currentGrm: currentGrm,
        potentialGrm: potentialGrm
      }
    }
  },
  methods: {
    async save () {
      try {
        // update all OS fields that have changed
        await Promise.all(this.expenses.map(expense => {
          if (expense !== this.osExpenses[expense.id]) {
            return this.$store.dispatch('os/updateField', { packageID: this.packageID, osID: this.os.id, field: expense })
          }
        }))

        await Promise.all(this.incomes.map(income => {
          if (income !== this.osIncomes[income.id]) {
            return this.$store.dispatch('os/updateField', { packageID: this.packageID, osID: this.os.id, field: income })
          }
        }))

        // save OS changes (taxes, mgmt fee, vacancy)
        await this.$store.dispatch('os/update', { packageID: this.packageID, os: this.os })
        this.hasSaved = true
        router.push(`/package/${this.$route.params.id}/sales-comparables`);
      } catch (err) {
        console.log(err)
        this.$toast.open({
          duration: 3500,
          message: 'Something went wrong, please try again or contact customer support',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    },

    newExpenseAdded (item) {
      this.expenses.push(item)
    },

    deleted (item) {
      this.expenses = this.expenses.filter(e => e.id !== item.id)
    },

    deletedIncome (item) {
      this.incomes = this.incomes.filter(e => e.id !== item.id)
    },

    increase (field) {
      let oldValue = this.os[field]

      if (oldValue) {
        this.$set(this.os, field, oldValue + 0.5)
      } else {
        this.$set(this.os, field, 0.5)
      }
    },

    decrease (field) {
      let oldValue = this.os[field]

      if (oldValue) {
        this.$set(this.os, field, Math.max(oldValue - 0.5, 0))
      } else {
        this.$set(this.os, field, 0)
      }
    },

    sum (t) {
      return this.expenses.reduce((acc, expense) => acc + (expense[t] || 0), 0) + this.taxes
    }
  },

  async created () {
    if (!this.packageID || this.packageID === ':id') {
      router.push('/')
    } else {
      try {
        await this.$store.dispatch('os/fetchList', this.packageID)

        if (!this.os || !this.os.id || Object.keys(this.os).length === 0) {
          await this.$store.dispatch('os/create', this.packageID)
        }

        if (!this.property.id) {
          await this.$store.dispatch('properties/fetchList')
        }

        await Promise.all([
          this.$store.dispatch('os/fetchFields', { packageID: this.packageID, osID: this.os.id }),
          this.property && this.property.id ? this.$store.dispatch('propertyUnits/fetchList', this.property.id) : Promise.resolve()
        ])

        // fill up local objects
        this.expenses = this.osExpenses
        this.incomes = this.osIncomes
      } catch (e) {
        console.log(e)
        router.push('/')
      }
    }
  },

  beforeRouteLeave (to, from, next) {
    if (this.property.id && !this.hasSaved) {
      this.$dialog.confirm({
        title: 'Unsaved changes',
        message: 'You have unsaved changes. Are you sure you want to leave the page?',
        type: 'is-danger',
        hasIcon: true,
        confirmText: 'Leave',
        onConfirm: () => {
          next()
        }
      })
    } else next()
  }
}
</script>

<style scoped>
.columns {
  margin: auto;
}
.percent-value {
  width: 2.5em;
  padding: 0.5em;
}
</style>
