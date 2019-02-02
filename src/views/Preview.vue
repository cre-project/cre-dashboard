<template>
  <div>
    <iframe
      id="pdf"
      width="100%"
      height="900"
      frameborder="0"
      :src="pdfURL"
    ></iframe>
  </div>
</template>
<script>

export default {
  computed: {
    pdfURL () {
      return `${process.env.VUE_APP_PDF_APP_URL}/${this.$route.params.id}`
    }
  }
}
</script>
