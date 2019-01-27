<template>
  <comparables
    compType="sale"
  />
</template>
<script>
import { router } from './../router'
import Comparables from '@/components/Comparables'

export default {
  components: {
    Comparables
  },
  data () {
    return {
    }
  },

  async created () {
    const packageID = this.$route.params.id
    if (!packageID || packageID === ':id') {
      router.push('/')
    }
  }
}
</script>
