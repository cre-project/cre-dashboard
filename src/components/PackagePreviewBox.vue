<template>
  <div
    class="preview-box"
    @click="editPackage"
  >
    <img
      class="preview-image"
      :src="pkg.cover_image_url || defaultImage"
    >
    <span
      class="overlay"
      :style="property.price ? '' : 'color: transparent'">
      <p>Price ${{ formatPrice (property.price) }}</p>
    </span>
    <div class="preview-title">{{ address }}</div>
    <div class="preview-content">
      <p>APN: {{ property.apn }}</p>
      <p>Date created: {{ date }}</p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { router } from './../router'

export default {
  props: {
    pkg: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      defaultImage: 'https://res.cloudinary.com/dxnzksg0a/image/upload/c_crop,h_276,w_296/v1549730082/enmu2ack1mgo7ojgsdfl.jpg'
    }
  },
  methods: {
    editPackage () {
      router.push(`/package/${this.pkg.id}/property-info`)
    },

    formatPrice (value) {
      let val = (value / 1).toFixed().replace(',', '.');
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  computed: {
    ...mapGetters({ propertyByPackageID: 'properties/byPackageID' }),

    property () {
      return this.propertyByPackageID(this.pkg.id) || {}
    },

    address () {
      if (this.property && this.property.address && this.property.address.street) {
        let street = this.property.address.street
        let city = this.property.address.city
        return city ? `${street}, ${city}` : street
      } else {
        return 'New Valuation'
      }
    },

    date () {
      let createdAt = this.pkg.created_at
      let date = createdAt instanceof Date ? createdAt : new Date(createdAt)
      return date.toUTCString()
    }
  }
}
</script>
