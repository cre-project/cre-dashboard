<template>
  <div class="home">
    <div class="box">
      <h1 class="title is-3 m-b-2">Password Reset</h1>
      <p>
        {{ isRequestingReset ? 'Please enter your email address. If you have an account with us you will receive an email with a password reset link.' : 'Please enter your new password to complete your password reset.' }}
      </p>

      <form class="m-t-2" @submit.prevent="submit">
        <div v-if="!isRequestingReset">
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
        </div>

        <div v-if="isRequestingReset">
          <b-field
            :type="errors.has('email') ? 'is-danger' : ''"
            :message="errors.has('email') ? errors.first('email') : ''"
            label="Email"
          >
            <b-input
              v-validate="'required|email'"
              v-model="email"
              name="email"
              placeholder="email address"
              icon="account"
            />
          </b-field>
        </div>

        <button
          type="submit"
          class="button is-dark is-fullwidth"
          @click.prevent="submit()"
        >Submit</button>
      </form>

      <div class="m-t-3">Don't have an account yet? <a href="https://offeringcre.com/free-trial">Sign up</a></div>
    </div>

  </div>
</template>

<script>
import { router } from './../router'

export default {
  data () {
    return {
      password: '',
      confirm: '',
      email: '',
      isRequestingReset: !this.$route.params.token
    }
  },
  methods: {
    async submit () {
      try {
        let valid = await this.$validator.validateAll()
        if (valid) {
          let msg = 'Your password has been reset. You can now log in.'

          if (this.isRequestingReset) {
            msg = 'Success. If you have an account with us, we will send you an email to reset your password.'
            await this.$store.dispatch('user/requestPasswordReset', { 'email': this.email })
          } else {
            await this.$store.dispatch('user/resetPassword', { 'password': this.password, 'token': this.$route.params.token })
            router.push('/login')
          }
          this.$toast.open({
            duration: 3500,
            message: msg,
            position: 'is-bottom',
            type: 'is-success'
          })
        }
      } catch (e) {
        console.log(e)
        this.$toast.open({
          duration: 3500,
          message: 'Password reset failed. Please contact our customer support.',
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
