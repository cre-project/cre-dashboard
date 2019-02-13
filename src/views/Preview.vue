<template>
  <div>
    <property-missing v-if="!property.id && !loading"/>

    <div
      v-show="property.id && !loading"
      class="save-button">
      <button
        class="save"
        :class="loading ? 'disabled' : ''"
        :disabled="loading"
        @click="exportPdf()"
      >
        Download PDF
      </button>
    </div>

    <iframe
      v-show="property.id && !loading"
      id="pdf"
      width="100%"
      height="940"
      frameborder="0"
      :src="pdfURL"
    ></iframe>
    <b-loading is-full-page="true" :active.sync="loading" :can-cancel="false"/>
  </div>
</template>
<script>
import { router } from './../router'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      propertyByPackageID: 'properties/byPackageID'
    }),

    packageID () {
      return this.$route.params.id
    },

    property () {
      return this.propertyByPackageID(this.packageID)
    },

    pdfURL () {
      return `${process.env.VUE_APP_PDF_APP_URL}/${this.packageID}`
    }
  },

  methods: {
    async exportPdf () {
      try {
        this.loading = true
        // const pdfEndpoint = `${process.env.VUE_APP_PDF_APP_URL}/export/pdf/${this.packageID}`

        let response = await this.$store.dispatch('packages/fetchPDF', this.packageID)

        // open file save dialog
        var url = URL.createObjectURL(new Blob([response]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'package.pdf')
        document.body.appendChild(link)
        link.click()
        this.loading = false
      } catch (err) {
        this.$toast.open({
          duration: 3500,
          message: 'Could not generate a PDF. Please contact our customer service if this behaviour persists.',
          position: 'is-bottom',
          type: 'is-danger'
        })
        this.loading = false
      }
    },
    openLoading () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 700)
    }
  },

  async created () {
    if (!this.packageID || this.packageID === ':id') {
      router.push('/')
    } else {
      this.openLoading()
      try {
        if (!this.property.id) {
          await this.$store.dispatch('properties/fetchList')
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>
.save-button {
  margin: 3em;
  margin-left: 16em;
}

.disabled {
  background-color: lightgray;
  color: gray;
  cursor: default;
}
</style>
