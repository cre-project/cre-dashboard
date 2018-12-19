<template>
  <div>
    <navigation-header selected="unit-mix"></navigation-header>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-semibold auto-margin">Unit Mix</h1>
      <div class="float-right" style="margin-right: 2em; margin-bottom: 0;">
        <b-field class="half-size" label="Total SqFt">
          <b-input v-model.number="totalSqFt"></b-input>
        </b-field>
      </div>
      <table style="margin-left:5em;margin-top:2em;width:90%;margin-bottom:2em;">
        <thead>
          <tr class="centered">
            <!-- <th/> -->
            <th>Bedrooms</th>
            <th>Bathrooms</th>
            <th>Current Rent/Mo.</th>
            <th>Potential Rent/Mo.</th>
          </tr>
        </thead>
        <tbody>
          <unit v-for="unit in units" :key="unit.id" :unit="unit"></unit>
          <tr class="centered is-grey">
            <td>Total: {{ numUnits }} units</td>
            <td>{{ totalSqFt }} SF</td>
            <td>{{ totalRentCurrent | money }}</td>
            <td>{{ totalRentPotential | money }}</td>
          </tr>
        </tbody>
      </table>
      <div class="spaced">
        <button class="save green" @click.prevent="addUnit">Add Another Unit</button>
        <button class="save" type="submit" @click="save">Save & Next</button>
      </div>
    </div>
  </div>
</template>
<script>
import Unit from '@/components/Unit';
import { router } from './../router';
import { mapActions } from 'vuex';
// import { uuidv4 } from '../utils'

export default {
  data () {
    return {
      units: [],
      currentUnit: '',
      totalSqFt: 0
    };
  },
  computed: {
    numUnits () {
      return this.units.length || '# ';
    },
    totalRentCurrent () {
      return this.units.reduce(
        (acc, unit) => acc + (Number(unit.currentRent) || 0),
        0
      );
    },
    totalRentPotential () {
      return this.units.reduce(
        (acc, unit) => acc + (Number(unit.potentialRent) || 0),
        0
      );
    }
  },
  methods: {
    ...mapActions('valuations', ['addUnits', 'addTotalSqFt', 'persist']),
    save () {
      this.addUnits(this.units);
      this.addTotalSqFt(this.totalSqFt);
      this.persist();
      router.push(`/package/${this.$route.params.id}/operating-statement`);
    },
    addUnit () {
      let id = 4; // uuidv4()
      this.units.push({ id: id });
      this.currentUnit = id;
    }
  },
  created () {
    this.units = this.$store.state.valuations.selectedValuation.units;
    this.totalSqFt =
      this.$store.state.valuations.selectedValuation.totalSqFt || 0;
  },
  components: {
    Unit: Unit
  }
};
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
