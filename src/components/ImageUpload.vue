<template>
  <label style="height: 12em;">
    <h2 class="has-text-weight-semibold m-b-1">{{ label }}</h2>
    <img
      :class="url && url != '' ? '' : 'hidden'"
      :src="url"
      id="preview"
    >
    <input
      type="file"
      class="save hidden"
      @input="loadImage"
    >
    <i
      class="large material-icons clickable"
      id="icon"
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
    }
  },

  methods: {

    loadExistingImage (previewEl, button, url) {
      previewEl.src = url
      previewEl.classList.remove('hidden')
      previewEl.classList.add('clickable')
      button.classList.remove('clickable')
      button.classList.add('hidden')
    },

    loadNewImage (previewEl, button, imgName, evt) {
      let file = evt.target.files[0]
      let reader = new FileReader()
      // let fileName = `images/${imgName}`

      reader.addEventListener('load', function (evt) {
        previewEl.src = evt.target.result
        previewEl.classList.remove('hidden')
        previewEl.classList.add('clickable')
        button.classList.remove('clickable')
        button.classList.add('hidden')
        // upload(fileName, evt.target.result)
      })
      reader.readAsDataURL(file)
    },

    loadImage (evt) {
      const logoPreview = document.querySelector('#preview')
      const logoIcon = document.querySelector('#icon')
      let fileName = `${this.userId}/logo.png`
      this.loadNewImage(logoPreview, logoIcon, fileName, evt)
    }
  }
}
</script>
