<template>
  <div>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-semibold m-l-0">{{ compType === 'sale' ? 'Sales' : 'Rent' }} Comparables</h1>

      <b-table
        :data="comparables"
        detailed
        :opened-detailed="detailed"
        detail-key="id"
        style="min-height: 20vh;"
        class="m-t-5"
        hoverable
        @details-open="setWip($event)"
      >
        <template slot-scope="props">
          <b-table-column
            label="Address"
            class="p-t-1-3"
            sortable
            centered
          >
            {{ props.row.address.street || '' }}
          </b-table-column>

          <b-table-column
            :visible="compType === 'rent'"
            label="Year Built"
            class="p-t-1-3"
            width="150"
            sortable
            centered
            numeric
          >
            {{ props.row.year_built }}
          </b-table-column>

          <b-table-column
            :visible="compType === 'rent'"
            label="Bedrooms"
            class="p-t-1-3"
            width="150"
            sortable
            centered
            numeric
          >
            {{ props.row.bedrooms }}
          </b-table-column>

          <b-table-column
            :visible="compType === 'rent'"
            field="date"
            class="p-t-1-3"
            label="Bathrooms"
            width="150"
            sortable
            centered
            numeric
          >
            {{ props.row.bathrooms }}
          </b-table-column>

          <b-table-column
            :visible="compType === 'rent'"
            label="Rent"
            class="p-t-1-3"
            sortable
            centered
            numeric
          >
            {{ props.row.rent | money }}
          </b-table-column>

          <b-table-column
            :visible="compType === 'sale'"
            label="Price"
            class="p-t-1-3"
            sortable
            centered
            numeric
          >
            {{ props.row.sales_price | money }}
          </b-table-column>

          <b-table-column
            :visible="compType === 'sale'"
            label="Cap Rate"
            class="p-t-1-3"
            sortable
            centered
            numeric
          >
            {{ props.row.cap_rate }}
          </b-table-column>

          <b-table-column
            :visible="compType === 'sale'"
            label="Price / Unit"
            class="p-t-1-3"
            sortable
            centered
            numeric
          >
            {{ pricePerUnit(props.row) | money }}
          </b-table-column>

          <b-table-column
            width="150"
            label="Delete"
            centered
          >
            <!-- <i class="material-icons">edit</i> -->
            <i
              class="material-icons"
              @click="delete(props.row.id)"
            >delete_forever</i>
          </b-table-column>
        </template>

        <template
          slot="detail"
          slot-scope="props"
        >
          <div
            id="add-more"
            class="expanded"
          >
            <span class="add-more-content text ita bold">Property Information</span>
            <span class="add-more-content text ita bold right">{{ compType === 'rent' ? 'Rent' : 'Financial' }} Information</span>
            <div class="popup-form">
              <!-- part 1 of the form -->
              <form id="form-1">
                <label>
                  <div>Property Address</div>
                  <input v-model="props.row.address.street">
                </label>
                <label>
                  <div>City</div>
                  <input v-model="props.row.address.city">
                </label>
                <div>
                  <label class="side-by-side">
                    <div>State</div>
                    <input
                      class="side-by-side"
                      v-model="props.row.address.state"
                    >
                  </label>
                  <label class="side-by-side">
                    <div>ZIP</div>
                    <input
                      class="side-by-side"
                      v-model="props.row.address.zip"
                    >
                  </label>
                </div>
                <image-upload label="Property Picture" :url="props.row.image_url" handler="xxx"/>
              </form>
              <!-- part 2 of the form -->
              <form id="form-2">
                <label class="narrow">
                  <div class="narrow">Year built</div>
                  <input
                    class="narrow"
                    v-model="props.row.year_built"
                  >
                </label>
                <label
                  class="narrow"
                  v-if="compType !== 'rent'"
                >
                  <div class="narrow">Square Feet</div>
                  <vue-numeric
                    input
                    class="narrow"
                    separator=","
                    v-model="props.row.square_feet"
                  ></vue-numeric>
                </label>
                <label
                  class="narrow"
                  v-if="compType !== 'rent'"
                >
                  <div class="narrow">Total Number of Units</div>
                  <input
                    class="narrow"
                    v-model="props.row.num_units"
                  >
                </label>
              </form>
              <!-- part 3 of the form for rentals -->
              <form
                id="form-5"
                v-if="compType === 'rent'"
              >
                <h3>Unit Type:</h3>
                <label class="half-size">
                  <div class="half-size"># Bedrooms</div>
                  <select
                    class="buttonize down-arrow"
                    v-model="props.row.bedrooms"
                  >
                    <option
                      disabled
                      value=""
                    >Please select one</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </label>
                <label class="half-size">
                  <div class="half-size"># Bathrooms</div>
                  <select
                    class="buttonize down-arrow"
                    v-model="props.row.bathrooms"
                  >
                    <option
                      disabled
                      value=""
                    >Please select one</option>
                    <option>1</option>
                    <option>1.5</option>
                    <option>2</option>
                    <option>2.5</option>
                    <option>3</option>
                  </select>
                </label>
              </form>
              <form
                id="form-6"
                v-if="compType === 'rent'"
              >
                <label class="half-size">
                  <div class="half-size more-padding">Current Rent/Mo.</div>
                  <vue-numeric
                    input
                    class="half-size"
                    currency="$"
                    separator=","
                    v-model="props.row.rent"
                  ></vue-numeric>
                </label>
              </form>
              <!-- part 3 of the form for sales comps -->
              <form
                id="form-5"
                v-if="compType !== 'rent'"
              >
                <label class="narrow">
                  <div class="narrow">Sales Price</div>
                  <vue-numeric
                    input
                    class="narrow"
                    currency="$"
                    separator=","
                    v-model="props.row.sales_price"
                  ></vue-numeric>
                </label>
                <label class="narrow">
                  <div class="narrow">Close of Escrow</div>
                  <input
                    class="narrow"
                    v-model="props.row.close_of_escrow"
                  >
                </label>
                <label class="narrow">
                  <div class="narrow">Cap Rate</div>
                  <input
                    class="narrow"
                    v-model="props.row.cap_rate"
                  >
                </label>
                <label class="narrow">
                  <div class="narrow">GRM</div>
                  <input
                    class="narrow"
                    v-model="props.row.grm"
                  >
                </label>
              </form>
              <form
                id="form-7"
                v-if="compType !== 'rent'"
              >
                <label class="half-size">
                  <div class="narrow">Price / SF</div>
                  <input
                    class="narrow"
                    :value="pricePerSf(props.row)"
                    readonly
                  >
                </label>
                <label class="half-size">
                  <div class="narrow">Price / Unit</div>
                  <input
                    class="narrow"
                    :value="pricePerUnit(props.row)"
                    readonly
                  >
                </label>
              </form>
              <button
                class="add"
                id="add-sales"
                @click.prevent="add()"
              >Save</button>
            </div>
          </div>
        </template>

        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>This valuation has no comparables yet.</p>
              <a
                class="button buttonize m-t-1"
                @click="addRow()"
              >Add a new comparable</a>
            </div>
          </section>
        </template>
      </b-table>
      <div class="float-right m-t-2">
        <div v-show="comparables.length > 0 && detailed.length === 0">
          <a
            id="g"
            class="button buttonize m-r-1"
            @click="addRow()"
          >Add a new comparable</a>
        </div>

        <button
          v-show="detailed.length === 0"
          class="save"
          type="submit"
          @click="next"
        >Save & Next</button>
      </div>
    </div>
  </div>
</template>
<script>
import { router } from './../router'
import formatMoney from 'accounting-js/lib/formatMoney.js'
import { mapGetters } from 'vuex'
import ImageUpload from '@/components/ImageUpload'

/** sales comp: */
//  id
//  year_built
//  sales_price
//  num_units
//  cap_rate
//  grm
//  close_of_escrow
//  image_url
//  square_feet
//  created_at
//  updated_at
//  user_id
const emptyComparable = {
  address: {},
  year_built: null,
  rent: 0,
  bedrooms: '',
  bathrooms: '',
  sales_price: 0,
  num_units: 0,
  close_of_escrow: null,
  cap_rate: null,
  grm: null,
  square_feet: 0,
  image_url: ''
}

export default {
  props: {
    compType: {
      type: String
    },
    propertyId: {
      type: String
    }
  },

  components: {
    ImageUpload
  },

  data () {
    return {
      showButton: true,
      detailed: [],
      wipComp: {},
      comparables: []
    }
  },

  computed: {
    ...mapGetters({
      soldProperties: 'soldProperties/listByPackageID'
    }),

    packageID () {
      return this.$route.params.id
    }

  },

  methods: {
    next () {
      let next = this.compType === 'sale' ? 'rent-comparables' : 'preview'
      router.push(`/package/${this.$route.params.id}/${next}`)
    },

    add () {
      this.wipComp = Object.assign({}, emptyComparable)
      this.detailed = []
    },

    async delete (id) {
      this.$dialog.confirm({
        title: 'Deleting Comparable',
        message: 'You can\'t undo this action. Are you sure you want to proceed?',
        type: 'is-danger',
        hasIcon: true,
        confirmText: 'Delete',
        onConfirm: async () => {
          try {
            // TODO so far only sales comps are supported
            await this.$store.dispatch('soldProperties/delete', id)
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

    toggle () {
      this.showButton = !this.showButton
    },

    pricePerUnit (comp) {
      let avg = (comp.sales_price || 0) / (comp.num_units || 1)
      return avg.toFixed(2)
    },

    pricePerSf (comp) {
      let avg = (comp.sales_price || 0) / (comp.square_feet || 1)
      return avg.toFixed(2)
    },

    format (number) {
      return formatMoney(number)
    },

    addRow () {
      let c = Object.assign({}, emptyComparable)
      c.id = 'new'
      this.detailed = ['new']
      this.wipComp = c
      this.comparables.push(c)
    },

    setWip (row) {
      this.detailed = [row.id]
      this.wipComp = this.comparables.filter(c => c.id === row.id)[0]
    }
  },

  async created () {
    const packageID = this.$route.params.id
    if (!packageID || packageID === ':id') {
      router.push('/')
    } else {
      try {
        // load data
        await this.$store.dispatch('packages/fetchList').then(() => {
          // TODO only supports sales comps now
          this.comparables = this.soldProperties(this.packageID)
        })
      } catch (e) {
        console.log(e)
        router.push('/')
      }
    }
  }
}
</script>
<style scoped>
.buttonize {
  max-height: 2.5em;
  padding: 5px 20px;
  border-radius: 100px;
  color: white;
  font-size: 1.1em;
  background-color: var(--button-blue);
}

#g {
  background-color: var(--bright-green);
  /* color: unset; */
}

.p-t-1-3 {
  padding-top: 1.3em;
}

.m-r-1 {
  margin-right: 1em;
}

.m-l-0 {
  margin-left: 0;
}

.m-t-1 {
  margin-top: 1em;
}

.m-t-5 {
  margin-top: 5em;
}

.m-t-10 {
  margin-top: 8em;
}

input {
  width: 15em;
}
.down-arrow {
  margin-bottom: 2em;
  margin-top: 0.5em;
  height: 2em;
  background-color: var(--bright-green);
}
#form-1 {
  margin-left: 3em;
}
#form-6 {
  width: 10%;
  float: left;
  display: block;
}
#form-7 {
  width: 10%;
  float: left;
  display: block;
}
.right {
  margin-left: 30em;
}
.add {
  margin-left: 7em;
  margin-top: 6em;
}
.narrow {
  width: 80%;
}
.side-by-side {
  width: 50%;
  float: left;
  margin-top: 0;
}
#label div {
  grid-row-end: 5;
}
#add-sales {
  margin-left: 35em;
  font-size: 1.1em;
  padding-left: 5em;
  padding-right: 5em;
  font-weight: 600;
}
.expanded {
  min-height: 35em;
}
#comparable-preview {
  max-height: 10em;
}
</style>
