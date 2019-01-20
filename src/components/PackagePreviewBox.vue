<template>
  <div
    class="preview-box"
    @click="editPackage"
  >
    <img
      class="preview-image"
      :src="pkg.preview || defaultImage"
    >
    <span
      class="overlay"
      v-show="property.price">
      Price ${{ formatPrice (property.price) }}
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
      defaultImage: 'http://res.cloudinary.com/dxnzksg0a/image/upload/v1531933140/sample.jpg'
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
  },

  async created () {
    try {
      await this.$store.dispatch('properties/fetchList')
    } catch (e) { }
  }
}
</script>
