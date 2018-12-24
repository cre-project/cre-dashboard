<template>
  <div>
    <div class="align-left">
      <package-preview-box :pkg="{property: {}}"/>
      <package-preview-box
        v-for="id in list"
        :key="id"
        :pkg="packages[id]"/>
    </div>
  </div>
</template>
<script>
import PackagePreviewBox from '@/components/PackagePreviewBox'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    PackagePreviewBox
  },
  computed: {
    ...mapState({ packages: state => state.packages.packages }),
    ...mapGetters({ list: 'packages/list' })
  },
  created () {
    this.$store.dispatch('packages/fetchList')
      .catch((err) => {
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
      })
  }
}
</script>
<style scoped>
.align-left {
  display: flex;
  justify-content: flex-start;
  padding: 0 4em;
}
</style>
