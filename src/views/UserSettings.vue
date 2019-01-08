<template>
  <div>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-semibold">User Settings</h1>
      <div class="cre-inner-content">
        <div class="columns">
          <div class="column">
            <form>
              <b-field expanded label="First Name">
                  <b-input v-model="user.first_name"></b-input>
              </b-field>

              <b-field expanded label="Last Name">
                <b-input v-model="user.last_name"></b-input>
              </b-field>

              <b-field label="Email">
                  <b-input type="email" v-model="user.email"></b-input>
              </b-field>

              <b-field expanded label="Phone Number">
                <b-input v-model="user.phone"></b-input>
              </b-field>
            </form>
          </div>

          <div class="column"></div>

          <div class="column">
            <div class="cre-inner-content ">
              <label style="height: 12em;">
                <div class="m-b-1">Profile Picture</div>
                <img
                  class="hidden"
                  id="profile-preview"
                >
                <input
                  type="file"
                  class="save hidden"
                  @input="loadProfilePic"
                >
                <i
                  class="large material-icons clickable"
                  id="profile-icon"
                >add_a_photo</i>
              </label>
            </div>
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
// import { upload, getUrl } from '../store/tools/images'

export default {
  data () {
    return {
      user: {}
    }
  },

  computed: {
    ...mapState({ authUser: state => state.user.authUser })

  },

  methods: {
    async save () {
      try {
        if (this.hasUpdated) {
          await this.$store.dispatch('user/update', this.user)
        }
        this.$toast.open({
          duration: 3500,
          message: 'Changes were saved.',
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
    },
    //     loadNewImage (previewEl, button, imgName, evt) {
    //       let file = evt.target.files[0]
    //       let reader = new FileReader()
    //       let fileName = `images/${imgName}`

    //       reader.addEventListener('load', function (evt) {
    //         previewEl.src = evt.target.result
    //         previewEl.classList.remove('hidden')
    //         previewEl.classList.add('clickable')
    //         button.classList.remove('clickable')
    //         button.classList.add('hidden')
    //         upload(fileName, evt.target.result)
    //       })
    //       reader.readAsDataURL(file)
    //     },
    //     loadExistingImage (previewEl, button, url) {
    //       previewEl.src = url
    //       previewEl.classList.remove('hidden')
    //       previewEl.classList.add('clickable')
    //       button.classList.remove('clickable')
    //       button.classList.add('hidden')
    //     },
    loadProfilePic (evt) {
    //       const profilePreview = document.querySelector('#profile-preview')
    //       const profileIcon = document.querySelector('#profile-icon')
    //       let fileName = `${this.userId}/profile.png`
    //       this.loadNewImage(profilePreview, profileIcon, fileName, evt)
    }
  },

  created () {
    // fill up the local user object
    this.user = this.authUser
  }

}
</script>
