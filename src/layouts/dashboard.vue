<template>
  <div>
    <main-header/>
    <div id="large-sub-header" class="float-right">
      <button
        class="m-2"
        @click="newPkg()">
        Add New Valuation
      </button>
    </div>
    <slot/>
  </div>
</template>

<script>
import MainHeader from '@/components/MainHeader';
import { router } from '@/router'

export default {
  components: {
    MainHeader
  },
  methods: {
    newPkg () {
      // TODO generate ID & create new package
      router.push('/package/id/property-info')
    }
  }
}
</script>
