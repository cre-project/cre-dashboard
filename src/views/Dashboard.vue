<template>
    <div>
        <div class="align-left">
            <package-preview-box :pkg="{property: ''}"></package-preview-box>
        </div>
    </div>
</template>
<script>
import PackagePreviewBox from '@/components/PackagePreviewBox'

export default {
  components: {
    PackagePreviewBox
  }
}
</script>
<style scoped>
.align-left {
  display: flex;
  justify-content: flex-start;
  padding: 0 4em;
}
</style>
