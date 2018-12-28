<template>
  <div>
    <user-nav />
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-semibold">User Settings</h1>
      <div class="cre-inner-content">
        <div class="columns">
          <div class="column">
            <form>
              <b-field expanded label="First Name">
                  <b-input v-model="user.firstName"></b-input>
              </b-field>

              <b-field expanded label="Last Name">
                <b-input v-model="user.lastName"></b-input>
              </b-field>

              <b-field label="Email">
                  <b-input type="email" v-model="user.email"></b-input>
              </b-field>

              <b-field expanded label="Phone Number">
                <b-input v-model="user.phoneNumber"></b-input>
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
import { mapActions } from 'vuex';
import { router } from './../router';
// import { upload, getUrl } from '../store/tools/images'

export default {
  data () {
    return {
      user: {}
    };
  },
  methods: {
    ...mapActions('users', ['set']),
    save () {
      //   this.set(this.user)
      router.push('./');
    }
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
    //     loadProfilePic (evt) {
    //       const profilePreview = document.querySelector('#profile-preview')
    //       const profileIcon = document.querySelector('#profile-icon')
    //       let fileName = `${this.userId}/profile.png`
    //       this.loadNewImage(profilePreview, profileIcon, fileName, evt)
    //     }
    //   },
    //   computed: {
    //     ...mapState({
    //       userId: state => state.users.currentId
    //     })
    //   },
    //   created () {
    //     // fill up the local user object
    //     this.user = this.$store.state.users.currentUser
    //     let vm = this
    //     // load logo and preview if they exist
    //     getUrl(`images/${this.$store.state.users.currentId}/profile.png`).then(downloadUrl => {
    //       if (downloadUrl) {
    //         vm.loadExistingImage(document.querySelector('#profile-preview'), document.querySelector('#profile-icon'), downloadUrl)
    //       }
    //     })
    //     getUrl(`images/${this.$store.state.users.currentId}/logo.png`).then(downloadUrl => {
    //       if (downloadUrl) {
    //         vm.loadExistingImage(document.querySelector('#logo-preview'), document.querySelector('#logo-icon'), downloadUrl)
    //       }
    //     })
  }
};
</script>
