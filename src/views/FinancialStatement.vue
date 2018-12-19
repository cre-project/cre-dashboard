<template>
  <div>
    <navigation-header selected="operating-statement"></navigation-header>
    <div class="cre-content">
      <div class="columns">
        <div class="column is-two-thirds">
          <h1
            class="subtitle is-size-4 has-text-weight-semibold"
            id="tc-header"
          >Operating Statement</h1>
          <main>
            <table id="os">
              <thead>
                <tr>
                  <th
                    class="sub-section l-align bolder"
                    colspan="2"
                  >Income</th>
                  <th class="sub-section">Current</th>
                  <th class="sub-section">Pro Forma</th>
                  <th></th>
                </tr>
              </thead>
              <tr class="is-grey">
                <td
                  class="l-align bold"
                  colspan="2"
                >GROSS POTENTIAL RENT</td>
                <td>
                  <span id="gpr-current">{{ grossRentCurrent | money }}</span>
                </td>
                <td>
                  <span id="gpr-future">{{ grossRentPotential | money }}</span>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Less: Vacancy/Deduction</td>
                <td class="setting">
                  <button
                    class="percent"
                    @click="decrease('vacancy')"
                  >-</button>
                  <span id="vacancy">{{ selectedValuation.vacancy || 0 }}%</span>
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
                <td></td>
              </tr>
              <tr class="is-grey">
                <td
                  class="l-align bold"
                  colspan="2"
                >EFFECTIVE RENTAL INCOME</td>
                <td>{{ currentEffectiveRent | money }}</td>
                <td>{{ potentiaEffectiveRent | money }}</td>
                <td></td>
              </tr>
              <tr>
                <td colspan="2">
                  <input
                    class="input is-small"
                    :value="current.otherIncome.label"
                  >
                </td>
                <td>
                  <vue-numeric
                    input
                    class="inline-edit"
                    separator=","
                    v-model.number="current.otherIncome.value"
                  ></vue-numeric>
                </td>
                <td>
                  <vue-numeric
                    input
                    class="inline-edit"
                    separator=","
                    v-model.number="potential.otherIncome.value"
                  ></vue-numeric>
                </td>
                <td>
                  <i class="icon is-small material-icons">delete_forever</i>
                </td>
              </tr>
              <tr class="is-grey">
                <td
                  class="l-align bold"
                  colspan="2"
                >EFFECTIVE GROSS INCOME</td>
                <td>{{ effectiveGrossIncome | money }}</td>
                <td>{{ potentialGrossIncome | money }}</td>
                <td></td>
              </tr>
              <tr>
                <td
                  class="sub-section l-align bolder"
                  colspan="5"
                >Expenses</td>
              </tr>
              <tr>
                <td class="l-align">
                  <input
                    class="input is-small"
                    :value="selectedValuation.taxes.label"
                  >
                </td>
                <td>
                  <vue-numeric
                    input
                    class="input is-small"
                    :precision="4"
                    currency="%"
                    currency-symbol-position="suffix"
                    v-model.number="selectedValuation.taxes.value"
                  ></vue-numeric>
                </td>
                <!-- ONLY ONE TAX VALUE - NO DISTINCTION BETWEEN CURRENT AND POTENTIAL -->
                <td id="taxes-current">{{ taxes | money }}</td>
                <td id="taxes-future">{{ taxes | money }}</td>
                <td></td>
              </tr>
              <tr>
                <!-- PERCENTAGE OF EFFECTIVE GROSS INCOME -->
                <td class="l-align">
                  <input
                    class="input is-small"
                    :value="selectedValuation.mgmtFee.label"
                  >
                </td>
                <td class="setting">
                  <button
                    class="percent"
                    @click="decrease('mgmtFee')"
                  >-</button>
                  <span id="mgmtFee">{{ selectedValuation.mgmtFee.value || 0 }}%</span>
                  <button
                    class="percent"
                    @click="increase('mgmtFee')"
                  >+</button>
                </td>
                <td id="mgmt-fee-current">{{ currentMgmtFee | money }}</td>
                <td id="mgmt-fee-future">{{ potentialMgmtFee | money }}</td>
                <td>
                  <i class="icon is-small material-icons">delete_forever</i>
                </td>
              </tr>
              <tr
                v-for="(e, index) in selectedValuation.expenses"
                :key="index"
              >
                <td
                  class="l-align"
                  colspan="2"
                >
                  <input
                    class="input is-small"
                    :value="e.label"
                  >
                </td>
                <td>
                  <vue-numeric
                    input
                    class="inline-edit"
                    separator=","
                    v-model.number="e.current"
                  ></vue-numeric>
                </td>
                <td>
                  <vue-numeric
                    input
                    class="inline-edit"
                    separator=","
                    v-model.number="e.potential"
                  ></vue-numeric>
                </td>
                <td>
                  <i
                    class="icon is-small material-icons"
                    @click="removeItem(index)"
                  >delete_forever</i>
                </td>
              </tr>
              <tr>
                <td colspan="3" />
                <td>Add Expense Item</td>
                <td>
                  <i
                    class="material-icons icon is-small"
                    @click="addItem()"
                  >add_circle</i>
                </td>
              </tr>
              <tr class="is-grey">
                <td
                  class="l-align bold"
                  colspan="2"
                >TOTAL EXPENSES</td>
                <td>{{ totalExpensesCurrent | money }}</td>
                <td>{{ totalExpensesPotential | money }}</td>
                <td></td>
              </tr>
              <tr>
                <!-- effective gross income minus total expenses -->
                <td
                  class="l-align bold"
                  colspan="2"
                >Net Operating Income</td>
                <td class="bold">{{ currentNetOperatingIncome | money }}</td>
                <td class="bold">{{ potentialNetOperatingIncome | money }}</td>
                <td></td>
              </tr>
            </table>
            <button
              class="save"
              id="operating-statement"
              type="submit"
              @click="save"
            >Save & Next</button>
          </main>
        </div>
        <side-form
          class="column"
          :stats="stats"
        ></side-form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { router } from './../router';
import SideForm from '@/components/SideForm';

export default {
  data () {
    return {
      current: { otherIncome: {} },
      potential: { otherIncome: {} },
      expenses: [],
      incomes: [],
      grossRentCurrent: 0,
      grossRentPotential: 0
    };
  },
  computed: {
    ...mapGetters('packages', ['byID']),
    selectedValuation () {
      return this.byID(this.$route.params.id)
    },
    currentVacancy () {
      return (
        (this.grossRentCurrent / 100) *
        (this.selectedValuation.vacancy || 0)
      ).toFixed(0);
    },
    /* INCOME  */
    potentialVacancy () {
      return (
        (this.grossRentPotential / 100) *
        (this.selectedValuation.vacancy || 0)
      ).toFixed(0);
    },
    // actual income coming from rent
    currentEffectiveRent () {
      return (this.grossRentCurrent - this.currentVacancy).toFixed(0);
    },
    potentiaEffectiveRent () {
      return (this.grossRentPotential - this.potentialVacancy).toFixed(0);
    },
    // effective rental income + other income
    effectiveGrossIncome () {
      return (
        Number(this.currentEffectiveRent) +
        (Number(this.current.otherIncome) || 0)
      ).toFixed(0);
    },
    potentialGrossIncome () {
      return (
        Number(this.potentiaEffectiveRent) +
        (Number(this.potential.otherIncome) || 0)
      ).toFixed(0);
    },
    /* EXPENSES  */
    taxes () {
      return (
        (this.selectedValuation.price / 100) *
        (this.selectedValuation.taxes.value || 0)
      ).toFixed(0);
    },
    currentMgmtFee () {
      return (
        (this.effectiveGrossIncome / 100) *
        (this.selectedValuation.mgmtFee.value || 0)
      ).toFixed(0);
    },
    potentialMgmtFee () {
      return (
        (this.potentialGrossIncome / 100) *
        (this.selectedValuation.mgmtFee.value || 0)
      ).toFixed(0);
    },
    // sum of all expenses
    totalExpensesCurrent () {
      return this.sum(this.current.expenses) + Number(this.currentMgmtFee);
    },
    totalExpensesPotential () {
      return this.sum(this.potential.expenses) + Number(this.potentialMgmtFee);
    },
    /* TOTAL */
    // effective gross income minus total expenses
    currentNetOperatingIncome () {
      return this.effectiveGrossIncome - this.totalExpensesCurrent;
    },
    potentialNetOperatingIncome () {
      return this.potentialGrossIncome - this.totalExpensesPotential
    },
    currentCapRate () {
      return (
        (Number(this.currentNetOperatingIncome) /
          (Number(this.selectedValuation.price) || 1)) *
        100
      ).toFixed(2);
    },
    potentialCapRate () {
      return (
        (Number(this.potentialNetOperatingIncome) /
          (Number(this.selectedValuation.price) || 1)) *
        100
      ).toFixed(2);
    },
    currentGrm () {
      return (
        Number(this.selectedValuation.price) / (this.grossRentCurrent || 1)
      ).toFixed(2);
    },
    potentialGrm () {
      return (
        Number(this.selectedValuation.price) / (this.grossRentPotential || 1)
      ).toFixed(2);
    },
    // stats for side form
    stats () {
      return {
        currentCapRate: this.currentCapRate,
        potentialCapRate: this.potentialCapRate,
        currentGrm: this.currentGrm,
        potentialGrm: this.potentialGrm
      };
    }
  },
  components: {
    SideForm: SideForm
  },
  methods: {
    save () {
      this.current.vacancy = this.currentVacancy;
      this.current.effectiveRent = this.currentEffectiveRent || 0;
      this.current.effectiveGrossIncome = this.effectiveGrossIncome;
      this.current.mgmtFee = this.currentMgmtFee;
      this.current.totalExpenses = this.totalExpensesCurrent;
      this.current.netOperatingIncome = this.currentNetOperatingIncome;
      this.current.capRate = this.currentCapRate;
      this.current.grm = this.currentGrm;
      this.current.grossRent = this.grossRentCurrent;

      this.potential.vacancy = this.potentialVacancy;
      this.potential.effectiveRent = this.potentialEffectiveRent || 0;
      this.potential.effectiveGrossIncome = this.potentialGrossIncome;
      this.potential.mgmtFee = this.potentialMgmtFee;
      this.potential.totalExpenses = this.totalExpensesPotential;
      this.potential.netOperatingIncome = this.potentialNetOperatingIncome;
      this.potential.capRate = this.potentialCapRate;
      this.potential.grm = this.potentialGrm;
      this.potential.grossRent = this.grossRentPotential;

      // TODO set percentage values (vacancy, mgmtFee, taxes) in Wip (selectedVacancy)
      // this.setWip({
      //   valuation: this.selectedValuation,
      //   id: this.selectedValuationId
      // });
      // this.setWipOS({ current: this.current, potential: this.potential });
      // this.persist();
      router.push(`./packages/${this.$route.params.id}/sales-comparables`);
    },
    removeItem (name) {
      this.$dialog.confirm({
        title: 'Deleting Expense Item',
        message: 'Are you sure you want to delete this item?',
        type: 'is-danger',
        hasIcon: true,
        confirmText: 'Delete Expense',
        onConfirm: () => this.removeExpense(name)
      });
    },
    addItem () {
      this.$dialog.prompt({
        title: 'New Expense Line Item',
        message: 'Please enter the expense name',
        inputAttrs: {
          placeholder: 'e.g. Property Tax'
        },
        onConfirm: value => this.addExpense({ name: value })
      });
    },
    increase (prop) {
      if (
        !this.selectedValuation[prop] ||
        this.selectedValuation[prop].isNaN ||
        this.selectedValuation[prop] === 'NaN'
      ) {
        this.selectedValuation[prop] = 1;
        // this.set(this.selectedValuation[prop], 1)
      } else this.selectedValuation[prop]++;
    },
    decrease (prop) {
      if (
        !this.selectedValuation[prop] ||
        this.selectedValuation[prop].isNaN ||
        this.selectedValuation[prop] === 'NaN'
      ) {
        // this.set(this.selectedValuation[prop], 0)
        this.selectedValuation[prop] = 0;
      } else this.selectedValuation[prop]--;
    },
    formatPercentage (value) {
      let val = (value / 10).toFixed(1).replace(',', '.');
      return val.toString().replace(/\B(?=(\d{1})+(?!\d))/g, ',');
    },
    sum (expenses) {
      return 10
      // return (
      //   Object.keys(expenses).reduce((acc, key) => acc + expenses[key], 0) +
      //   Number(this.taxes)
      // );
    }
  }
}
</script>

<style scoped>
.columns {
  margin: auto;
}
</style>
