<template>
  <div>
    <div v-if="packages.length === 0 && !isLoading" class="cre-content vertically-centered">
        <i class="material-icons" style="font-size: 75px;">domain_disabled</i>
        <p class="subtitle" align="center">You didn't create any packages yet.<br> After you create one it will magically appear here!</p>
    </div>

    <div class="align-left">
      <package-preview-box
        v-show="!isLoading"
        v-for="item in packages"
        :key="item.id"
        :pkg="item"/>
    </div>
    <b-loading is-full-page="true" :active.sync="isLoading" :can-cancel="true"/>
  </div>
</template>
<script>
import PackagePreviewBox from '@/components/PackagePreviewBox'
import { mapGetters } from 'vuex'

export default {
  components: {
    PackagePreviewBox
  },
  data () {
    return {
      isLoading: true
    }
  },
  computed: {
    ...mapGetters({ packages: 'packages/list' })
  },
  async created () {
    try {
      await this.$store.dispatch('packages/fetchList')
      await this.$store.dispatch('properties/fetchList')
      this.isLoading = false
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
