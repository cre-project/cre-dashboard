<template>
    <div>
        <main-header/>
        <settings-navbar/>
        <slot/>
    </div>
</template>

<script>
import SettingsNavbar from '@/components/SettingsNavbar'
import MainHeader from '@/components/MainHeader'

export default {
  components: {
    SettingsNavbar,
    MainHeader
  }

}
</script>
