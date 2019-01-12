<template>
  <div>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-semibold">Billing and Subscription</h1>
      <div class="cre-inner-content">
        <div class="columns is-variable is-8">
          <div class="column">
            <h2 class="subtitle is-size-5 has-text-weight-bold">Subscription</h2>
            <b-field>
                <b-input v-model="user.subscription" disabled></b-input>
            </b-field>
            <button
              class="save"
              style="min-width: 16em;"
              type="submit"
              @click="redirect"
            >CHANGE</button>
          </div>

          <div class="column">
            <h2 class="subtitle is-size-5 has-text-weight-bold">Billing address</h2>
            <form>
              <b-field label="Street">
                  <b-input v-model="address.address"></b-input>
              </b-field>

              <b-field label="State">
                  <b-input v-model="address.state"></b-input>
              </b-field>

              <b-field grouped>
                <b-field expanded label="City">
                    <b-input v-model="address.city"></b-input>
                </b-field>

                <b-field expanded label="ZIP">
                  <b-input v-model="address.zip"></b-input>
                </b-field>
              </b-field>
            </form>
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
    // ...mapState({ companyByID: state => state.companies.getByID })
  },
  methods: {
    async redirect () {
      try {
        let redirectUrl = await this.$store.dispatch('user/getPabblyUrl')
        if (redirectUrl) {
          window.location = redirectUrl
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
