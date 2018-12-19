<template>
  <nav id="bottom" class="navbar cre-nav sub-header" role="navigation">
    <ul class="navbar-menu" style="margin-left: 25em;">
      <li class="navbar-item is-hoverable">
        <router-link to="/user-settings">ACCOUNT SETTINGS</router-link>
      </li>
      <!-- <li class="navbar-item m-l-2">
        <router-link to="/agent-info">AGENT INFORMATION</router-link>
      </li> -->
      <li class="navbar-item m-l-2">
        <router-link to="/company-settings">COMPANY SETTINGS</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {

}
</script>

<style scoped>
#bottom {
  background-color: var(--medium-grey);
}
</style>
