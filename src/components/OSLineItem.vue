<template>
  <tr>
    <td
      class="l-align"
      colspan="2"
    >
      <div class="double-input">
        <input
          :style="item.percent ? 'width: 45%; margin-right: 2em;' : ''"
          class="input is-small"
          :value="item.name"
        >
        <vue-numeric
          v-if="item.percent && !item.percentWithButton"
          input
          :style="item.percent ? 'width: 30%;' : ''"
          class="input is-small "
          :precision="4"
          currency="%"
          currency-symbol-position="suffix"
          v-model.number="item.percent"
          :minus="false"
        />

        <div v-if="item.percentWithButton" class="setting">
          <button
            class="percent"
            @click="item.percent--"
          >-</button>
          {{ item.percent || 0 }}%
          <button
            style="margin-right: 2.55em;"
            class="percent"
            @click="item.percent++"
          >+</button>
        </div>
      </div>
    </td>

    <td>
      <vue-numeric
        v-if="!item.percent"
        input
        class="inline-edit"
        currency="$"
        separator=","
        :precision="0"
        :minus="false"
        v-model.number="item.current_value"
      />
      <p v-else>{{ item.current_value | money }}</p>
    </td>

    <td>
      <vue-numeric
        v-if="!item.percent"
        input
        class="inline-edit"
        currency="$"
        separator=","
        :precision="0"
        :minus="false"
        v-model.number="item.potential_value"/>
      <p v-else>{{ item.potential_value | money }}</p>
    </td>

    <td>
      <i
        class="icon is-small material-icons clickable"
        @click="removeItem()"
      >delete_forever</i>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    }
  },
  data () {
    return {
      visible: true,
      percentage: 0,
      current: 0,
      potential: 0
    }
  },
  methods: {
    async removeItem () {
      this.$dialog.confirm({
        title: 'Deleting Operating Statement Item',
        message: 'You can\'t undo this action. Are you sure you want to proceed?',
        type: 'is-danger',
        hasIcon: true,
        confirmText: 'Delete',
        onConfirm: async () => {
          try {
            await this.$store.dispatch('os/deleteField', { packageID: this.$route.params.id, osID: this.item.operating_statement_id, field: this.item })
            this.$emit('deleted', this.item)
          } catch (err) {
            this.$toast.open({
              duration: 3500,
              message: `Item could not be deleted: ${err.message}`,
              position: 'is-bottom',
              type: 'is-danger'
            })
          }
        }
      })
    }
  },
  created () {
    this.percentage = this.item.percentage || 0
    this.current = this.item.current || 0
    this.potential = this.item.potential || 0
  }
}
</script>
<style>
.deleted {
  display: none;
}
.double-input {
  display: flex;
  justify-content: space-between;
  width: 90%;
}
</style>
