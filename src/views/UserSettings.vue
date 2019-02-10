<template>
  <div>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-semibold">User Settings</h1>
      <div class="cre-inner-content">
        <div class="columns">
          <div class="column">
            <form>
              <b-field
                  :type="errors.has('firstName') ? 'is-danger' : ''"
                  :message="errors.has('firstName') ? errors.first('firstName') : ''"
                  expanded label="First Name"
                >
                    <b-input
                      v-validate="'alpha_spaces'"
                      v-model="user.first_name"
                      name="firstName"
                    />
              </b-field>

              <b-field
                  :type="errors.has('lastName') ? 'is-danger' : ''"
                  :message="errors.has('lastName') ? errors.first('lastName') : ''"
                  expanded label="Last Name"
                >
                    <b-input
                      v-validate="'alpha_spaces'"
                      v-model="user.last_name"
                      name="lastName"
                    />
              </b-field>

              <b-field
                  :type="errors.has('email') ? 'is-danger' : ''"
                  :message="errors.has('email') ? errors.first('email') : ''"
                  label="Email"
                >
                  <b-input
                    v-validate="'email'"
                    name="email"
                    type="email"
                    v-model="user.email"
                  />
              </b-field>

              <b-field
                  :type="errors.has('phone') ? 'is-danger' : ''"
                  :message="errors.has('phone') ? errors.first('phone') : ''"
                  label="Phone Number"
                >
                  <b-input
                    v-validate="'alpha_dash|max:12'"
                    name="phone"
                    v-model="user.phone_number"
                  />
              </b-field>
            </form>
          </div>

          <div class="column"></div>

          <div class="column">
            <image-upload label="Profile Picture" :url="user.picture_url" handler="user/updateImage"/>
          </div>
        </div>

        <div class="float-right">
          <button
            class="save"
            type="submit"
            @click="save"
          >Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import ImageUpload from '@/components/ImageUpload'

export default {
  data () {
    return {
      user: {}
    }
  },

  components: {
    ImageUpload
  },

  computed: {
    ...mapState({ authUser: state => state.user.authUser })

  },

  methods: {
    async save () {
      try {
        let valid = await this.$validator.validateAll()
        if (!valid) {
          this.$toast.open({
            duration: 3500,
            message: 'Please check your input',
            position: 'is-bottom',
            type: 'is-danger'
          })
          return
        }
        if (this.hasUpdated) {
          await this.$store.dispatch('user/update', this.user)
        }
        this.$toast.open({
          duration: 3500,
          message: 'Your changes have been saved.',
          position: 'is-bottom',
          type: 'is-success'
        })
      } catch (err) {
        console.log(err)
        this.$toast.open({
          duration: 3500,
          message: 'Could not save user settings',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    },

    hasUpdated () {
      for (let k in Object.keys(this.user)) {
        if (this.authUser[k] && this.authUser[k] !== this.user[k]) {
          return true
        }
      }
      return false
    }
  },

  created () {
    // fill up the local user object
    this.user = this.authUser
  }

}
</script>
