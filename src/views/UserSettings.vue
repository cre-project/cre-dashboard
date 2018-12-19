<template>
  <div>
    <user-nav/>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-semibold">User Settings</h1>
      <div class="columns block">
        <div class="column m-t-1">
          <label class="half-sze">
            <div class="half-size">First Name</div>
            <input class="half-size" v-model="user.firstName">
          </label>
          <label class="half-size">
            <div class="half-size">Last Name</div>
            <input class="half-size" v-model="user.lastName">
          </label>
          <label>
            <div>Email</div>
            <input v-model="user.email">
          </label>
          <label>
            <div>Phone Number</div>
            <input v-model="user.phoneNumber">
          </label>
        </div>
        <div class="column m-t-2 m-l-2">
          <label style="height: 12em;">
            <div class="m-b-1">Profile Picture</div>
            <img class="hidden" id="profile-preview">
            <input type="file" class="save hidden" @input="loadProfilePic">
            <i class="large material-icons clickable" id="profile-icon">add_a_photo</i>
          </label>
          <button
            class="save"
            style="width: 35%; margin-top: 4em; margin-left: 18em;"
            type="submit"
            @click="save"
          >Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
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
