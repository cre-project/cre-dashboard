<template>
  <aside class="total">
    <div class="side-form">
      <div class="bold l-align">Price</div>
      <vue-numeric
        input
        id="os-right"
        currency="$"
        separator=","
        :value="price"
        :minus="false"
        @change.native="setPrice($event.target.value)"
      ></vue-numeric>
      <!-- price per unit/ sf - units & sf from unit mix -->
      <p class="bold l-align">
        Price/Unit: {{ pricePerUnit | money }}
        <br>
        Price/SF: {{ pricePerSf | money }}
      </p>
    </div>
    <table style="width:85%;">
      <thead>
        <tr>
          <th></th>
          <th>Current</th>
          <th>Pro Forma</th>
        </tr>
      </thead>
      <tr>
        <td>CAP Rate</td>
        <td>{{ stats.currentCapRate }}</td>
        <td>{{ stats.potentialCapRate }}</td>
      </tr>
      <tr>
        <td>GRM</td>
        <td>{{ stats.currentGrm }}</td>
        <td>{{ stats.potentialGrm }}</td>
      </tr>
    </table>
  </aside>
</template>
<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: {
    stats: {
      type: Object,
      required: true
    },
    property: {
      type: Object,
      required: true
    },
    numUnits: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({ os: state => state.os.operatingStatement }),
    ...mapGetters({ packageByID: 'packages/byID', propertyByPackageID: 'properties/byPackageID' }),

    price () {
      return this.property.price || 0
    },

    pricePerSf () {
      let sqft = this.property.total_square_feet

      return sqft ? (this.property.price / sqft) : 0
    },

    pricePerUnit () {
      return (this.property.price || 0) / (this.numUnits || 1)
    }
  },
  methods: {
    async setPrice (value) {
      let data = this.property
      data.price = value

      try {
        await this.$store.dispatch('properties/update', { property: data })
      } catch (err) {
        this.$toast.open({
          duration: 3500,
          message: `Price could not be updated: ${err}`,
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    }
  },
  created () {
    this.$store.dispatch('properties/fetchList')
  }
}
</script>
