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
              <td>{{ os.grossRentCurrent || 0 | money }}</td>
              <td>{{ os.grossRentPotential || 0 | money }}</td>
              <td/>
            </tr>
            <tr>
              <td>Less: Vacancy/Deduction</td>
              <td class="setting">
                <button
                  class="percent"
                  @click="decrease('vacancy')"
                >-</button>
                 {{ selectedValuation.vacancy || 0 }}%
                <button
                  class="percent"
                  @click="increase('vacancy')"
                >+</button>
              </td>
              <td>
                -
                <span id="vacancy-current">{{ (currentVacancy || 0) | money }}</span>
              </td>
              <td>
                -
                <span id="vacancy-future">{{ (potentialVacancy || 0) | money }}</span>
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
            />

            <tr>
              <td colspan="3" />
              <td>Add Expense</td>
              <td>
                <i
                  class="material-icons icon is-small clickable"
                  @click="addItem(false)"
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
      ></side-form>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import { router } from './../router'
import SideForm from '@/components/SideForm'
import LineItem from '@/components/OSLineItem'

export default {
  components: {
    SideForm: SideForm,
    LineItem: LineItem
  },

  computed: {
    ...mapState({ os: state => state.os.operatingStatement }),
    ...mapGetters({
      packageByID: 'packages/byID',
      expenses: 'os/expenses',
      incomes: 'os/incomes',
      calculatedValues: 'os/calculatedValues'
    }),

    selectedValuation () {
      return this.packageByID(this.$route.params.id)
    },

    /** CALCULATED VALUES */
    currentVacancy () {
      return this.calculatedValues.currentVacancy
    },

    potentialVacancy () {
      return this.calculatedValues.potentialVacancy
    },

    currentEffectiveRent () {
      return this.calculatedValues.currentEffectiveRent
    },

    potentialEffectiveRent () {
      return this.calculatedValues.potentialEffectiveRent
    },

    effectiveGrossIncome () {
      return this.calculatedValues.effectiveGrossIncome
    },

    potentialGrossIncome () {
      return this.calculatedValues.potentialGrossIncome
    },

    /** CALCULATIONS BASED ON OS CALCULATED VALUES & PACKAGE DATA */
    // FIXME mgmtFee & taxes are separate OS fields - users shouldn't be able to change them?
    currentMgmtFee () {
      return ((this.effectiveGrossIncome / 100) * (this.selectedValuation.mgmtFee.value || 0)).toFixed(0)
    },

    potentialMgmtFee () {
      return ((this.potentialGrossIncome / 100) * (this.selectedValuation.mgmtFee.value || 0)).toFixed(0)
    },

    taxes () {
      return ((this.selectedValuation.price / 100) * (this.selectedValuation.taxes.value || 0)).toFixed(0)
    },

    /* TOTAL expenses & incomes */
    totalExpensesCurrent () {
      return this.sum(this.expenses, 'current') + this.currentMgmtFee
    },

    totalExpensesPotential () {
      return this.sum(this.expenses, 'potential') + this.potentialMgmtFee
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

      if (!this.selectedValuation.price) {
        currentCapRate = 'n/a'
        potentialCapRate = 'n/a'
      } else {
        currentCapRate = (this.currentNetOperatingIncome / this.selectedValuation.price * 100).toFixed(2) + '%'
        potentialCapRate = (this.potentialNetOperatingIncome / this.selectedValuation.price * 100).toFixed(2) + '%'
      }

      if (!this.os.grossRentCurrent) {
        currentGrm = 'n/a'
      } else {
        currentGrm = (this.selectedValuation.price / this.os.grossRentCurrent).toFixed(2)
      }

      if (!this.os.grossRentPotential) {
        potentialGrm = 'n/a'
      } else {
        potentialGrm = (this.selectedValuation.price / this.os.grossRentPotential).toFixed(2)
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
      //     this.current.vacancy = this.currentVacancy;
      //     this.current.effectiveRent = this.currentEffectiveRent || 0;
      //     this.current.effectiveGrossIncome = this.effectiveGrossIncome;
      //     this.current.mgmtFee = this.currentMgmtFee;
      //     this.current.totalExpenses = this.totalExpensesCurrent;
      //     this.current.netOperatingIncome = this.currentNetOperatingIncome;
      //     this.current.capRate = this.currentCapRate;
      //     this.current.grm = this.currentGrm;
      //     this.current.grossRent = this.grossRentCurrent;

      //     this.potential.vacancy = this.potentialVacancy;
      //     this.potential.effectiveRent = this.potentialEffectiveRent || 0;
      //     this.potential.effectiveGrossIncome = this.potentialGrossIncome;
      //     this.potential.mgmtFee = this.potentialMgmtFee;
      //     this.potential.totalExpenses = this.totalExpensesPotential;
      //     this.potential.netOperatingIncome = this.potentialNetOperatingIncome;
      //     this.potential.capRate = this.potentialCapRate;
      //     this.potential.grm = this.potentialGrm;
      //     this.potential.grossRent = this.grossRentPotential;

      //     // TODO set percentage values (vacancy, mgmtFee, taxes) in Wip (selectedVacancy)
      //     // this.setWip({
      //     //   valuation: this.selectedValuation,
      //     //   id: this.selectedValuationId
      //     // });
      //     // this.setWipOS({ current: this.current, potential: this.potential });
      //     // this.persist();
      router.push(`./packages/${this.$route.params.id}/sales-comparables`);
    },
    addItem () {
      this.$dialog.prompt({
        title: 'New Expense Line Item',
        message: 'Please enter the expense name',
        inputAttrs: {
          placeholder: 'e.g. Property Tax'
        },
        onConfirm: async (value) => {
          try {
            await this.$store.dispatch('os/addField', { name: value, operating_statement_id: this.$route.params.id, is_income: false })
          } catch (err) {
            this.$toast.open({
              duration: 3500,
              message: `Item could not be added: ${err.message}`,
              position: 'is-bottom',
              type: 'is-danger'
            })
          }
        }
      })
    },
    //   formatPercentage (value) {
    //     let val = (value / 10).toFixed(1).replace(',', '.');
    //     return val.toString().replace(/\B(?=(\d{1})+(?!\d))/g, ',');
    //   },
    sum (expenses) {
      return 10
      // return Object.keys(expenses).reduce((acc, key) => acc + expenses[key], 0) + this.taxes
    }
  }
}
</script>

<style scoped>
.columns {
  margin: auto;
}
</style>
