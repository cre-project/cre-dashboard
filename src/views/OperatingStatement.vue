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

            <!-- Expense line items -->
            <line-item
              v-for="(expense, index) in expenses"
              :item="expense"
              :key="index"
              @deleted="deleted"
            />

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

export default {
  data () {
    return {
      incomes: [],
      expenses: [],
      os: {},
      property: {}
    }
  },

  components: {
    SideForm: SideForm,
    LineItem: LineItem
  },

  computed: {
    ...mapGetters({
      packageByID: 'packages/byID',
      osByPackageID: 'os/byPackageID',
      osExpenses: 'os/expenses',
      osIncomes: 'os/incomes',
      propertyByPackageID: 'properties/byPackageID',
      unitsByPropertyID: 'propertyUnits/listByPropertyID'
    }),

    packageID () {
      return this.$route.params.id
    },

    propertyUnits () {
      if (this.property && this.property.id) {
        return this.unitsByPropertyID(this.property.id) || []
      }
      return []
    },

    currentRent () {
      return this.propertyUnits.reduce((acc, unit) => acc + (unit.current_rent || 0), 0)
    },

    potentialRent () {
      return this.propertyUnits.reduce((acc, unit) => acc + (unit.potential_rent || 0), 0)
    },

    /** CALCULATED VALUES */
    calculated () {
      let os = this.os || {}
      let otherIncome = this.incomes[0] || { current: 0, potential: 0 }
      let vacancy = os.vacancy || 0

      let currentVacancy = ((this.currentRent / 100) * vacancy)
      let potentialVacancy = ((this.potentialRent / 100) * vacancy)

      // actual income coming from rent
      let currentEffectiveRent = (this.currentRent - currentVacancy)
      let potentialEffectiveRent = (this.potentialRent - potentialVacancy)

      // effective rental income + other income
      let effectiveGrossIncome = (currentEffectiveRent + otherIncome.current)
      let potentialGrossIncome = (potentialEffectiveRent + otherIncome.potential)

      return {
        currentVacancy: currentVacancy,
        potentialVacancy: potentialVacancy,
        currentEffectiveRent: currentEffectiveRent,
        potentialEffectiveRent: potentialEffectiveRent,
        currentGrossRent: this.currentRent,
        potentialGrossRent: this.potentialRent,
        effectiveGrossIncome: effectiveGrossIncome,
        potentialGrossIncome: potentialGrossIncome
      }
    },
    currentVacancy () {
      return this.calculated.currentVacancy
    },

    potentialVacancy () {
      return this.calculated.potentialVacancy
    },

    currentEffectiveRent () {
      return this.calculated.currentEffectiveRent
    },

    potentialEffectiveRent () {
      return this.calculated.potentialEffectiveRent
    },

    currentGrossRent () {
      return this.calculated.currentGrossRent
    },

    potentialGrossRent () {
      return this.calculated.potentialGrossRent
    },

    effectiveGrossIncome () {
      return this.calculated.effectiveGrossIncome
    },

    potentialGrossIncome () {
      return this.calculated.potentialGrossIncome
    },

    /** CALCULATIONS BASED ON OS CALCULATED VALUES & OS DATA */
    currentMgmtFee () {
      if (this.os.mgmt_fee) {
        return (this.effectiveGrossIncome || 0 / 100) * (this.os.mgmt_fee || 0)
      }
      return 0
    },

    potentialMgmtFee () {
      if (this.os.mgmt_fee) {
        return (this.potentialGrossIncome || 0 / 100) * (this.os.mgmt_fee || 0)
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
      if (!this.currentRent) {
        currentGrm = 'n/a'
      } else {
        currentGrm = (this.property.price / this.currentRent).toFixed(2)
      }

      if (!this.potentialRent) {
        potentialGrm = 'n/a'
      } else {
        potentialGrm = (this.property.price / this.potentialRent).toFixed(2)
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
    //   formatPercentage (value) {
    //     let val = (value / 10).toFixed(1).replace(',', '.');
    //     return val.toString().replace(/\B(?=(\d{1})+(?!\d))/g, ',');
    //   },
  },

  async created () {
    if (!this.packageID || this.packageID === ':id') {
      router.push('/')
    } else {
      try {
        await this.$store.dispatch('os/fetchList', this.packageID)
        let os = this.osByPackageID(this.packageID)

        if (!os) {
          os = await this.$store.dispatch('os/create', this.packageID)
        }

        await Promise.all([
          this.$store.dispatch('os/fetchFields', { packageID: this.packageID, osID: os.id }),
          this.$store.dispatch('properties/fetchList')
        ])
        // fill up local objects
        this.os = os
        this.property = this.propertyByPackageID(this.packageID)
        this.$store.dispatch('propertyUnits/fetchList', this.property.id)
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
