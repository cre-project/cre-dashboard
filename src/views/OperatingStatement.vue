<template>
  <div class="cre-content">
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
                 {{ os.vacancy || 0 }}%
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
              @deleted="deleted"
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
                 {{ os.mgmt_fee || 0 }}%
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
      ></side-form>
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
      modalOpen: false
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
      return this.incomes[0] || { current: 0, potential: 0 }
    },

    /** CALCULATED VALUES */
    currentGrossRent () {
      return this.propertyUnits.reduce((acc, unit) => acc + (unit.current_rent || 0), 0)
    },

    potentialGrossRent () {
      return this.propertyUnits.reduce((acc, unit) => acc + (unit.potential_rent || 0), 0)
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
      return this.currentEffectiveRent + this.otherIncome.current
    },

    potentialGrossIncome () {
      return this.potentialEffectiveRent + this.otherIncome.potential
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
        return (this.potentialGrossIncome || 0 / 100) * this.os.mgmt_fee
      }
      return 0
    },

    taxes () {
      return (this.property.price || 0 / 100) * (this.os.taxes || 0)
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
    save () {
      // TODO update all OS fields

      // TODO save OS changes (taxes, mgmt fee, vacancy)

      //     this.current.vacancy = this.currentVacancy;
      //     this.current.effectiveRent = this.currentEffectiveRent || 0;
      //     this.current.effectiveGrossIncome = this.effectiveGrossIncome;
      //     this.current.mgmtFee = this.currentMgmtFee;
      //     this.current.totalExpenses = this.totalExpensesCurrent;
      //     this.current.netOperatingIncome = this.currentNetOperatingIncome;
      //     this.current.capRate = this.currentCapRate;
      //     this.current.grm = this.currentGrm;
      //     this.current.grossRent = this.rent_current;

      //     this.potential.vacancy = this.potentialVacancy;
      //     this.potential.effectiveRent = this.potentialEffectiveRent || 0;
      //     this.potential.effectiveGrossIncome = this.potentialGrossIncome;
      //     this.potential.mgmtFee = this.potentialMgmtFee;
      //     this.potential.totalExpenses = this.totalExpensesPotential;
      //     this.potential.netOperatingIncome = this.potentialNetOperatingIncome;
      //     this.potential.capRate = this.potentialCapRate;
      //     this.potential.grm = this.potentialGrm;
      //     this.potential.grossRent = this.rent_potential;

      //     // TODO set percentage values (vacancy, mgmtFee, taxes) in Wip (selectedVacancy)
      //     // this.setWip({
      //     //   valuation: this.currentPackage,
      //     //   id: this.selectedValuationId
      //     // });
      //     // this.setWipOS({ current: this.current, potential: this.potential });
      //     // this.persist();
      router.push(`./packages/${this.$route.params.id}/sales-comparables`);
    },

    newExpenseAdded (item) {
      this.expenses.push(item)
    },

    deleted (item) {
      this.expenses = this.expenses.filter(e => e.id !== item.id)
    },

    increase (field) {
      let oldValue = this.os[field]

      if (oldValue) {
        this.$set(this.os, field, oldValue + 1)
      } else {
        this.$set(this.os, field, 1)
      }
    },

    decrease (field) {
      let oldValue = this.os[field]

      if (oldValue) {
        this.$set(this.os, field, Math.max(oldValue - 1, 0))
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

        if (!this.os) {
          await this.$store.dispatch('os/create', this.packageID)
        }

        if (!this.property.id) {
          await this.$store.dispatch('properties/fetchList')
        }

        await Promise.all([
          this.$store.dispatch('os/fetchFields', { packageID: this.packageID, osID: this.os.id }),
          this.$store.dispatch('propertyUnits/fetchList', this.property.id)
        ])

        // fill up local objects
        this.expenses = this.osExpenses
        this.incomes = this.osIncomes
      } catch (e) {
        console.log(e)
        router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.columns {
  margin: auto;
}
</style>
