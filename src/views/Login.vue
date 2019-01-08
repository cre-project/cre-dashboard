<template>
  <div class="home">
    <div class="box">
      <h1 class="title is-3">Offering CRE</h1>
      <h1 class="subtitle">Dashboard Login</h1>
      <form @submit.prevent="onLogin">
        <b-field
          :type="errors.has('email') ? 'is-danger' : ''"
          :message="errors.has('email') ? errors.first('email') : ''"
        >
          <b-input
            v-validate="'required|email'"
            v-model="email"
            type="text"
            name="email"
            placeholder="email address"
            icon="account"
          />
        </b-field>
        <b-field
          :type="errors.has('password') ? 'is-danger' : ''"
          :message="errors.has('password') ? errors.first('password') : ''"
        >
          <b-input
            v-validate="'required'"
            v-model="password"
            type="password"
            name="password"
            placeholder="password"
            icon="lock"
          />
        </b-field>

        <button
          type="submit"
          class="button is-dark is-fullwidth"
          @click.prevent="onLogin"
        >Log In</button>
        <div class="m-t-3">No account? <a href="https://offeringcre.com/free-trial">Sign up</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { router } from './../router'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async onLogin () {
      try {
        let valid = await this.$validator.validateAll()
        if (valid) {
          await this.$store.dispatch('user/login', { email: this.email, password: this.password })
          router.push('/')
        }
      } catch (e) {
        this.$toast.open({
          duration: 3500,
          message: 'Login failed. Please check your email and password.',
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
