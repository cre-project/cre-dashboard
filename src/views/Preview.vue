<template>
  <div>
    <iframe id="pdf" width="100%" height="900" frameborder="0" :src="pdfURL"></iframe>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    // ...mapState({
    //   valuationId: state => state.valuations.selectedValuationId,
    //   userId: state => state.users.currentId
    // }),
    pdfURL () {
      return (
        process.env.PDF_APP +
        // `{"valuationId": "${this.valuationId}","userId": "${this.userId}"}`
        `{"valuationId": "","userId": ""}`
      );
    }
  }
};
</script>
