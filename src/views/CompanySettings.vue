<template>
  <div class="cre-content">
    <h1 class="subtitle is-size-4 has-text-weight-semibold">Company Settings</h1>
    <div class="cre-inner-content">
      <div class="columns">
        <div class="column">
          <form>
            <b-field
              :type="errors.has('company name') ? 'is-danger' : ''"
              :message="errors.has('company name') ? errors.first('company name') : ''"
              expanded label="Company Name"
            >
              <b-input
                v-model="company.name"
                v-validate="'required'"
                name="company name"
              ></b-input>
            </b-field>

            <b-field
              :type="errors.has('website URL') ? 'is-danger' : ''"
              :message="errors.has('website URL') ? errors.first('website URL') : ''"
              expanded label="Website URL"
            >
              <b-input
                v-validate="'url:require_protocol'"
                v-model="company.website_url"
                name="website URL"
              />
            </b-field>
          </form>
        </div>

        <div class="column"/>

        <div class="column">
          <image-upload label="Company Logo" :url="company.logo_url"/>
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
</template>

<script>
import { mapState } from 'vuex'
import ImageUpload from '@/components/ImageUpload'

export default {
  data () {
    return {
      company: {}
    }
  },

  components: {
    ImageUpload
  },

  computed: {
    ...mapState({ userCompany: state => state.user.company })

  },

  methods: {
    async save () {
      try {
        if (this.hasUpdated) {
          await this.$store.dispatch('user/updateCompany', this.company)
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
      for (let k in Object.keys(this.company)) {
        if (this.userCompany[k] && this.userCompany[k] !== this.company[k]) {
          return true
        }
      }
      return false
    }
  },

  async created () {
    this.company = this.$store.state.user.company
  }
}
</script>
