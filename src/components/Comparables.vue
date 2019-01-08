<template>
  <div>
    <navigation-header selected="rent-comparables"></navigation-header>
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
            {{ props.row.address }}
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
            {{ props.row.yearBuilt }}
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
            {{ props.row.salesPrice | money }}
          </b-table-column>

          <b-table-column
            :visible="compType === 'sale'"
            label="Cap Rate"
            class="p-t-1-3"
            sortable
            centered
            numeric
          >
            {{ props.row.capRate }}
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
              @click="deleteComparable({compId: props.row.id, compType: compType})"
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
                  <input v-model="props.row.address">
                </label>
                <label>
                  <div>City</div>
                  <input v-model="props.row.city">
                </label>
                <div>
                  <label class="side-by-side">
                    <div>State</div>
                    <input
                      class="side-by-side"
                      v-model="props.row.state"
                    >
                  </label>
                  <label class="side-by-side">
                    <div>ZIP</div>
                    <input
                      class="side-by-side"
                      v-model="props.row.zip"
                    >
                  </label>
                </div>
                <label class="m-t-10">
                  <div>Property Picture</div>
                  <img
                    :src="props.row.imageUrl && props.row.imageUrl !== '' ? props.row.imageUrl : ''"
                    :class="props.row.imageUrl && props.row.imageUrl !== '' ? 'clickable' : 'hidden'"
                    :id="`preview-${props.row.id}`"
                  >
                  <input
                    type="file"
                    class="save hidden"
                    @input="loadComparablePic($event, props.row.id)"
                  >
                  <i
                    :class="props.row.imageUrl && props.row.imageUrl !== '' ? 'hidden' : 'large material-icons clickable'"
                    :id="`icon-${props.row.id}`"
                  >add_a_photo</i>
                </label>
              </form>
              <!-- part 2 of the form -->
              <form id="form-2">
                <label class="narrow">
                  <div class="narrow">Year built</div>
                  <input
                    class="narrow"
                    v-model="props.row.yearBuilt"
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
                    v-model="props.row.sf"
                  ></vue-numeric>
                </label>
                <label
                  class="narrow"
                  v-if="compType !== 'rent'"
                >
                  <div class="narrow">Total Number of Units</div>
                  <input
                    class="narrow"
                    v-model="props.row.numUnits"
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
                    v-model="props.row.salesPrice"
                  ></vue-numeric>
                </label>
                <label class="narrow">
                  <div class="narrow">Close of Escrow</div>
                  <input
                    class="narrow"
                    v-model="props.row.closeOfEscrow"
                  >
                </label>
                <label class="narrow">
                  <div class="narrow">Cap Rate</div>
                  <input
                    class="narrow"
                    v-model="props.row.capRate"
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
          @click="save"
        >Save & Next</button>
      </div>
    </div>
  </div>
</template>
<script>
// import router from '../router/index'
// import accounting from 'accounting'
// import { mapState, mapActions } from 'vuex'
// import { emptyComparable } from '../store/tools/templates'
// import { uuidv4 } from '../utils'
// import { upload } from '../store/tools/images'

export default {
  props: {
    compType: {
      type: String
    },
    comparables: {
      type: Array
    }
  },
  data () {
    return {
      showButton: true,
      detailed: [],
      wipComp: {}
    }
  }
  //   computed: {
  //     ...mapState({
  //       savedRentComparables: state => state.valuations.selectedValuation.rentComps,
  //       savedSalesComparables: state => state.valuations.selectedValuation.salesComps,
  //       userId: state => state.users.currentId
  //     }),
  //     comparables () {
  //       return this.compType === 'rent' ? this.savedRentComparables : this.savedSalesComparables
  //     }
  //   },
  //   methods: {
  //     ...mapActions('valuations', ['persist', 'deleteComparable']),
  //     save () {
  //       this.persist()
  //       let next = this.compType === 'sale' ? './rent-comparables' : './preview'
  //       router.push(next)
  //     },
  //     add () {
  //       this.persist()
  //       this.wipComp = Object.assign({}, emptyComparable)
  //       this.detailed = []
  //     },
  //     toggle () {
  //       this.showButton = !this.showButton
  //     },
  //     pricePerUnit (comp) {
  //       let avg = (comp.salesPrice || 0) / (comp.numUnits || 1)
  //       return this.format(avg.toFixed(2))
  //     },
  //     pricePerSf (comp) {
  //       let avg = (comp.salesPrice || 0) / (comp.sf || 1)
  //       return this.format(avg.toFixed(2))
  //     },
  //     format (number) {
  //       return accounting.formatMoney(number)
  //     },
  //     addRow () {
  //       let c = Object.assign({}, emptyComparable)
  //       let id = uuidv4()
  //       this.detailed = [id]
  //       c.id = id
  //       c.pricePerUnit = this.pricePerUnit
  //       c.pricePerSf = this.pricePerSf
  //       this.wipComp = c
  //       this.$store.dispatch('valuations/addComparable', {comparable: c, compType: this.compType})
  //     },
  //     loadNewImage (previewEl, button, imgName, evt) {
  //       let vm = this
  //       let file = evt.target.files[0]
  //       let reader = new FileReader()
  //       let fileName = `images/${imgName}`

  //       reader.addEventListener('load', function (evt) {
  //         previewEl.src = evt.target.result
  //         previewEl.classList.remove('hidden')
  //         previewEl.classList.add('clickable')
  //         button.classList.remove('clickable')
  //         button.classList.add('hidden')
  //         upload(fileName, evt.target.result).then(url => {
  //           vm.wipComp.imageUrl = url
  //         })
  //       })
  //       reader.readAsDataURL(file)
  //     },
  //     loadComparablePic (evt, compId) {
  //       const comparablePreview = document.querySelector(`#preview-${compId}`)
  //       const comparableIcon = document.querySelector(`#icon-${compId}`)
  //       let fileName = `${this.userId}/${compId}.png`
  //       this.loadNewImage(comparablePreview, comparableIcon, fileName, evt)
  //     },
  //     setWip (row) {
  //       this.detailed = [row.id]
  //       this.wipComp = this.comparables.filter(c => c.id === row.id)[0]
  //     }
  //   }
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
