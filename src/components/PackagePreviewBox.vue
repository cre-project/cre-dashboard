<template>
  <div
    class="preview-box"
    @click="editPackage"
  >
    <img
      class="preview-image"
      :src="pkg.preview"
    >
    <span
      class="overlay"
      v-show="pkg.price"
    >Price ${{ formatPrice (pkg.price) }}</span>
    <div class="preview-title">{{ pkg.property.address || "New Valuation" }}, {{ pkg.property.city }}</div>
    <div class="preview-content">APN {{ pkg.property.apn }}</div>
  </div>
</template>
<script>
// import { mapActions } from 'vuex'
import { router } from './../router';

export default {
  props: {
    pkg: {
      type: Object,
      required: true
    }
  },
  methods: {
    // ...mapActions('valuations', ['setWip', 'toggleEditing']),
    editPackage () {
      this.$toast.open({
        duration: 3500,
        message: 'Edit Package',
        position: 'is-bottom',
        type: 'is-info'
      });
      //   this.setWip({valuation: this.valuation, id: this.id})
      //   this.toggleEditing()
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
  }
};
</script>
