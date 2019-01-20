<template>
  <label style="height: 12em;">
    <h2 class="has-text-weight-semibold m-b-1">{{ label }}</h2>
    <img
      :class="imageShown ? 'clickable' : 'hidden'"
      :src="url"
      ref="preview"
    >
    <input
      type="file"
      class="save hidden"
      :class="imageShown ? '' : 'clickable'"
      @input="loadNewImage"
    >
    <i
      class="large material-icons"
      :class="imageShown ? 'hidden' : 'clickable'"
    >add_a_photo</i>
  </label>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    url: {
      type: String,
      default: null
    },
    // vuex store action for storing image URL
    handler: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      imageShown: false
    }
  },

  methods: {
    loadNewImage (evt) {
      let file = evt.target.files[0]
      let reader = new FileReader()
      let previewEl = this.$refs['preview']

      reader.addEventListener('load', function (evt) {
        previewEl.src = evt.target.result
        this.imageShown = true
      })
      this.upload(file)
      reader.readAsDataURL(file)
    },

    // *********** Upload file to Cloudinary ******************** //
    upload (file) {
      let vm = this
      let xhr = new XMLHttpRequest()
      let fd = new FormData()
      xhr.open('POST', process.env.VUE_APP_CLOUDINARY_UPLOAD_URL, true)
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

      xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
          try {
            // file uploaded successfully
            let response = JSON.parse(xhr.responseText)
            let url = response.secure_url
            // store image URL in the database
            vm.$store.dispatch(vm.handler, url)
          } catch (e) {
            vm.showError(`Cloudinary response could not be handled: ${e}`)
          }
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          vm.showError(`Non-200 status from Cloudinary: ${xhr.statusText}`)
        }
      }

      // preset is needed for unsigned uploads
      fd.append('upload_preset', process.env.VUE_APP_CLOUDINARY_PRESET)
      fd.append('file', file)
      xhr.send(fd)
    },

    showError (err) {
      this.imageShown = false
      console.log(err)
      this.$toast.open({
        duration: 3500,
        message: 'Image upload failed. Pick a different image or try again later.',
        position: 'is-bottom',
        type: 'is-danger'
      })
    }
  },

  created () {
    if (this.url && this.url !== '') {
      this.imageShown = true
    }
  }
}
</script>
