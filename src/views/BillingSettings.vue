<template>
  <div>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-semibold">Billing and Subscription</h1>
      <div class="cre-inner-content">
        <div class="columns is-variable is-8 p-t-2">
          <div class="column is-two-fifths">
            <h2 class="subtitle is-size-5 has-text-weight-bold">Your Current Subscription</h2>
            <b-field>
                <p>{{ subscriptionName }}</p>
            </b-field>
            <button
              class="save"
              style="min-width: 16em; margin-top: 3em;"
              type="submit"
              @click="redirect"
            >CHANGE</button>
          </div>

          <div class="column">
            <div class="cre-inner-box">
              <p>
                As we want to make sure your payment information is safe we are using a third party service called Stripe as our trusted payment provider and aren’t storing any of your sensitive information ourselves. When you click "Change" on this page a new window will open which will give you the ability to change your billing and subscription information.
                <br/>
                <br/>
                You can follow the following documentation on how to change things:
                <br/>
                <a href="https://drive.google.com/drive/u/1/folders/1uI0QIeKjjIOMQF259vZZHcPneItxiDeS">Documentation</a>
                <br/>
                <br/>
                After you are done making your changes simply close the additional window and reload this page. After that you are good to go.
              </p>
            </div>
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
      address: {},
      subscriptions: {
        '5c1bbc8a2abc0f049777ded6': 'Trial',
        '5c57e7b5847b645ab8b8a99e': 'Great',
        '5c57e7c8847b645ab8b8a99f': 'Better'
      }
    }
  },

  computed: {
    ...mapState({ user: state => state.user.authUser }),
    subscriptionName () {
      let subscription = this.user.subscription
      let name = this.subscriptions[subscription]
      if (!subscription || !name) {
        return 'You have no active subscription'
      }
      return name
    }
  },
  methods: {
    async redirect () {
      try {
        let redirectUrl = await this.$store.dispatch('user/getPabblyUrl')
        if (redirectUrl) {
          window.open(redirectUrl, '_blank')
        } else {
          window.open('https://offeringcre.com/free-trial', '_blank')
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
