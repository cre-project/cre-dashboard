<template>
  <div>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-semibold">Billing and Subscription</h1>
      <div class="cre-inner-content">
        <div class="columns is-variable is-8">
          <div class="column">
            <h2 class="subtitle is-size-5 has-text-weight-bold">Subscription</h2>
            <b-field>
                <p>{{ user.subscription || 'You have no active subscription'}}</p>
            </b-field>
            <button
              class="save"
              style="min-width: 16em; margin-top: 3em;"
              type="submit"
              @click="redirect"
            >CHANGE</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      address: {}
    }
  },

  computed: {
    ...mapState({ user: state => state.user.authUser })
  },
  methods: {
    async redirect () {
      try {
        let redirectUrl = await this.$store.dispatch('user/getPabblyUrl')
        if (redirectUrl) {
          window.location = redirectUrl
        } else {
          window.location = 'https://offeringcre.com/free-trial'
        }
      } catch (e) {
        console.log(e)
        this.$toast.open({
          duration: 3500,
          message: 'Something went wrong. Please contact our customer support.',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    }
  }
}
</script>
