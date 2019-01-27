<template>
  <div>
    <div v-if="packages.length === 0" class="cre-content">
        <p class="subtitle">There are no valuations to show.</p>
    </div>

    <div class="align-left">
      <package-preview-box
        v-for="item in packages"
        :key="item.id"
        :pkg="item"/>
    </div>
  </div>
</template>
<script>
import PackagePreviewBox from '@/components/PackagePreviewBox'
import { mapGetters } from 'vuex'

export default {
  components: {
    PackagePreviewBox
  },
  computed: {
    ...mapGetters({ packages: 'packages/list' })
  },
  async created () {
    try {
      await this.$store.dispatch('packages/fetchList')
    } catch (err) {
      if (err.response) {
        // non-200 server response
        console.log(err.response)
        console.log(JSON.stringify(err))
      } else if (err.request) {
        // no response came from the server
        console.log('request:', err.request)
        console.log(err.message)
      }
      this.$toast.open({
        duration: 3500,
        message: `Couldn't load packages: ${err.message}`,
        position: 'is-bottom',
        type: 'is-danger'
      })
    }
  }
}
</script>
<style scoped>
.align-left {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0 4em;
}
</style>
