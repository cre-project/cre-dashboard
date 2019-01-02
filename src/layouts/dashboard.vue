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
    async newPkg () {
      try {
        let pkg = await this.$store.dispatch('packages/create')
        router.push(`/package/${pkg.id}/property-info`)
      } catch (err) {
        console.log(err.message)
        this.$toast.open({
          duration: 3500,
          message: 'Couldn\'t create a new package',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    }
  }
}
</script>
