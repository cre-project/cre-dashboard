<template>
  <tr class="editable">
    <td/>
    <td>
      <select class="buttonize down-arrow"
        :value="bedrooms"
        @input="$emit('update:bedrooms', $event.target.value)"
      >
        <option disabled value="">Please select one</option>
        <option>Studio</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
      </select>
    </td>
    <td>
      <select class="buttonize down-arrow"
        :value="bathrooms"
        @input="$emit('update:bathrooms', $event.target.value)"
      >
        <option disabled value="">Please select one</option>
        <option>1</option>
        <option>1.5</option>
        <option>2</option>
        <option>2.5</option>
        <option>3</option>
      </select>
    </td>
    <td>
      <vue-numeric
        currency="$"
        separator=","
        v-bind:minus="false"
        input
        class="inline-edit"
        :value="current_rent"
        @input="$emit('update:current_rent', $event)"
        ></vue-numeric>
    </td>
    <td>
      <vue-numeric
        currency="$"
        separator=","
        v-bind:minus="false"
        input
        class="inline-edit"
        :value="potential_rent"
        @input="$emit('update:potential_rent', $event)"
        ></vue-numeric>
    </td>
  </tr>
</template>
<script>

export default {
  props: {
    bedrooms: {
      type: [String, Number]
    },
    bathrooms: {
      type: [String, Number]
    },
    current_rent: {
      type: Number
    },
    potential_rent: {
      type: Number
    }
  }
}
</script>
