<template>
  <comparables
    compType="sale"
    :comparables="comparables"
  />
</template>
<script>
import Comparables from '@/components/Comparables'

export default {
  components: {
    Comparables
  },
  data () {
    return {
      comparables: []
    }
  }
}
</script>
