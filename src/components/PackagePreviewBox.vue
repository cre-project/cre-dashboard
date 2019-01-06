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
      v-show="pkg.price"
    >Price ${{ formatPrice (property.price) }}</span>
    <div class="preview-title">{{ property.address || "New Valuation" }}, {{ property.city }}</div>
    <div class="preview-content">APN {{ property.apn }}</div>
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
    ...mapGetters({ propertyByID: 'properties/byID' }),

    property () {
      this.propertyByID(this.pkg.property_id)
    },

    editPackage () {
      this.$toast.open({
        duration: 3500,
        message: 'Edit Package',
        position: 'is-bottom',
        type: 'is-info'
      })
      router.push(`/package/${this.pkg.id}/property-info`)
    },

    formatPrice (value) {
      let val = (value / 1).toFixed().replace(',', '.');
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  computed: {
    date () {
      let createdOn = this.pkg.createdOn;
      if (createdOn instanceof Date) {
        return createdOn.toUTCString()
      } else {
        return createdOn.toDate().toUTCString();
      }
    }
  },

  created () {
    this.$store.dispatch('properties/fetchList')
  }
}
</script>
