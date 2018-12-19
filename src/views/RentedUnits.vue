<template>
  <comparables compType="rent" :comparables="comparables"/>
</template>
<script>
import Comparables from '@/components/Comparables'
import { mapState } from 'vuex'

export default {
  components: {
    Comparables
  },
  computed: {
    ...mapState({
      comparables: state => state.valuations.selectedValuation.rentComps
    })
  }
}
</script>
