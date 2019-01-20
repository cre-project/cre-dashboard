<template>
  <comparables
    compType="sale"
    :comparables="comparables"
  />
</template>
<script>
import { router } from './../router'
import { mapGetters } from 'vuex'
import Comparables from '@/components/Comparables'

export default {
  components: {
    Comparables
  },
  data () {
    return {
      comparables: []
    }
  },

  computed: {
    ...mapGetters({
      propertyByPackageID: 'properties/byPackageID'
    })
  },

  async created () {
    const packageID = this.$route.params.id
    if (!packageID || packageID === ':id') {
      router.push('/')
    } else {
      // load data
      try {
        await this.$store.dispatch('packages/fetchList')
        await this.$store.dispatch('properties/fetchList').then(() => {
          this.property = this.propertyByPackageID(packageID)
          this.$store.dispatch('soldProperties/fetchList', packageID)
          this.totalSqFt = this.property.total_square_feet || 0
        })
      } catch (e) {
        console.log(e)
        router.push('/')
      }
    }
  }
}
</script>
