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
      $ <vue-numeric
        input
        class="inline-edit"
        separator=","
        :value="current_rent"
        @input="$emit('update:current_rent', $event)"
        />
    </td>
    <td>
      $ <vue-numeric
        input
        class="inline-edit"
        separator=","
        :value="potential_rent"
        @input="$emit('update:potential_rent', $event)"
        />
    </td>
  </tr>
</template>
<script>

export default {
  props: {
    bedrooms: {
      type: String
    },
    bathrooms: {
      type: String
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
