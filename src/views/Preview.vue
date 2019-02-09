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
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      propertyByPackageID: 'properties/byPackageID'
    }),

    property () {
      return this.propertyByPackageID(this.$route.params.id)
    },

    pdfURL () {
      return `${process.env.VUE_APP_PDF_APP_URL}/${this.$route.params.id}`
    }
  }
}
</script>
