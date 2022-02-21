<template>
  <div id="app">
    <CustomSuggest
    :is-multiple-choice="true"
    @changeSelectedTags = changeSelectedTags />
  </div>
</template>

<script>
import CustomSuggest from './components/CustomSuggest';

export default {
  name: 'App',

  components: {
    CustomSuggest,
  },

  methods: {
    changeSelectedTags(tags) {
      console.log(tags);
    },
  }
}
</script>

<style>
#app {
  font-family: "-apple-system",BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
