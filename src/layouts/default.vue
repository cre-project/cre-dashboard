<template>
    <div>
        <main-header/>
        <navbar/>
        <slot/>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import MainHeader from '@/components/MainHeader'

export default {
  components: {
    Navbar,
    MainHeader
  }

}
</script>
