<template>
  <div>
    <property-missing v-if="!property.id"/>
    <iframe v-else
      id="pdf"
      width="100%"
      height="940"
      frameborder="0"
      :src="pdfURL"
    ></iframe>
  </div>
</template>
<script>
import { router } from './../router'
import { mapGetters } from 'vuex'

export default {
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

  async created () {
    if (!this.packageID || this.packageID === ':id') {
      router.push('/')
    } else {
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
