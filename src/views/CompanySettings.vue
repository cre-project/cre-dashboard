<template>
    <div class="cre-content">
      <h1 class="subtitle is-size-4 has-text-weight-semibold">Company Settings</h1>
      <div class="columns block">
        <div class="column m-t-1">
          <label class="half-sze">
          <h2 class="has-text-weight-semibold">Company Name</h2>
          <input v-model="user.companyName">
          </label>
          <label class="half-size">
          <h2 class="has-text-weight-semibold">Website URL</h2>
          <input v-model="user.websiteURL">
          </label>
        </div>
        <div class="column m-t-2 m-l-2">
          <label style="height: 12em;">
          <h2 class="has-text-weight-semibold m-b-1">Company Logo</h2>
            <img class="hidden" id="logo-preview">
            <input type="file" class="save hidden" @input="loadLogo">
            <i class="large material-icons clickable" id="logo-icon">add_a_photo</i>
          </label>
          <button class="save" style="width: 35%; margin-top: 4em; margin-left: 18em;" type="submit" @click="save">Save</button>
        </div>
      </div>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
// import { upload, getUrl } from '../store/tools/images'
// import UserNav from '@/components/UserNav'

export default {
  data () {
    return {
      user: {}
    }
  },
  methods: {
    ...mapActions('users', ['set']),
    save () {
      this.set(this.user)
      this.$toast.open({
        message: 'Your changes were saved.',
        type: 'is-success',
        position: 'is-bottom'
      })
    },
    loadNewImage (previewEl, button, imgName, evt) {
      let file = evt.target.files[0]
      let reader = new FileReader()
      let fileName = `images/${imgName}`

      reader.addEventListener('load', function (evt) {
        previewEl.src = evt.target.result
        previewEl.classList.remove('hidden')
        previewEl.classList.add('clickable')
        button.classList.remove('clickable')
        button.classList.add('hidden')
        upload(fileName, evt.target.result)
      })
      reader.readAsDataURL(file)
    },
    loadExistingImage (previewEl, button, url) {
      previewEl.src = url
      previewEl.classList.remove('hidden')
      previewEl.classList.add('clickable')
      button.classList.remove('clickable')
      button.classList.add('hidden')
    },
    loadLogo (evt) {
      const logoPreview = document.querySelector('#logo-preview')
      const logoIcon = document.querySelector('#logo-icon')
      let fileName = `${this.userId}/logo.png`
      this.loadNewImage(logoPreview, logoIcon, fileName, evt)
    }
  },
  computed: {
    ...mapState({
      userId: state => state.users.currentId
    })
  },
  created () {
    // fill up the local user object
    this.user = this.$store.state.users.currentUser
    let vm = this
    // load and preview if it exists
    getUrl(`images/${this.$store.state.users.currentId}/logo.png`).then(downloadUrl => {
      if (downloadUrl) {
        vm.loadExistingImage(document.querySelector('#logo-preview'), document.querySelector('#logo-icon'), downloadUrl)
      }
    })
  }
}
</script>
