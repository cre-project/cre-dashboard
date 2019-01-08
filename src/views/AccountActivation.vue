<template>
  <div class="home">
    <div class="box">
      <h1 class="title is-3 m-b-2">Welcome to Offering CRE!</h1>
      <div class="m-t-2 m-b-2">
        <h2 class="subtitle is-4">Account Activation</h2>
        <p>
          Please enter your new password to complete your account activation.
        </p>
      </div>

      <form @submit.prevent="onActivate">
        <b-field
          :type="errors.has('password') ? 'is-danger' : ''"
          :message="errors.has('password') ? errors.first('password') : ''"
          label="Password"
        >
          <b-input
            v-validate="'required'"
            v-model="password"
            type="password"
            name="password"
            placeholder="password"
            ref="password"
            icon="lock"
          />
        </b-field>

        <b-field
          :type="errors.has('confirm') ? 'is-danger' : ''"
          :message="errors.has('confirm') ? errors.first('confirm') : ''"
          label="Confirm Password"
        >
          <b-input
            v-validate="'required|confirmed:password'"
            v-model="confirm"
            type="password"
            name="confirm"
            placeholder="confirm password"
            icon="lock"
            data-vv-as="password"
          />
        </b-field>

        <button
          type="submit"
          class="button is-dark is-fullwidth"
          @click.prevent="submit()"
        >Submit</button>
      </form>
    </div>

  </div>
</template>

<script>
import { router } from './../router'

export default {
  data () {
    return {
      password: '',
      confirm: ''
    }
  },
  methods: {
    async submit () {
      try {
        let valid = await this.$validator.validateAll()
        if (valid) {
          await this.$store.dispatch('user/activate', { 'password': this.password, 'customer_id': this.$route.params.customer_id })
          this.$toast.open({
            duration: 3500,
            message: 'Account activation completed. You can now log in.',
            position: 'is-bottom',
            type: 'is-success'
          })
          router.push('/login')
        }
      } catch (e) {
        this.$toast.open({
          duration: 3500,
          message: 'Account activation failed. Please contact our customer support.',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    }
  }
}
</script>

<style scoped>
form button {
  margin-top: 1.5em;
}

.home {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: url("../assets/login.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  padding: 0;
}

.box {
  max-width: 40em;
  padding: 4em;
}
</style>
