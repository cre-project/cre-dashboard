<template>
  <tr class="editable">
      <td>
          <select class="buttonize down-arrow" v-model="unit.type">
              <option disabled value="">Please select one</option>
              <option>Studio</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
          </select>
      </td>
      <td>
          <select class="buttonize down-arrow" v-model="unit.bathroom">
              <option disabled value="">Please select one</option>
              <option>1</option>
              <option>1.5</option>
              <option>2</option>
              <option>2.5</option>
              <option>3</option>
          </select>
      </td>
      <td>$ <vue-numeric input class="inline-edit" separator="," v-model="unit.currentRent"></vue-numeric></td>
      <td>$ <vue-numeric input class="inline-edit" separator="," v-model="unit.potentialRent"></vue-numeric></td>
  </tr>
</template>
<script>

export default {
  props: {
    unit: {
      type: Object,
      required: true
    }
  }
}
</script>
<style scoped>
</style>
