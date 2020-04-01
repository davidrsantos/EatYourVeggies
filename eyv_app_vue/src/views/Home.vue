<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    {{items}}
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data: () => ({
    items: []
  }),
  methods: {
    getItems() {
    axios.get('/agents').then(response => {
          this.items = response.data;
          console.log("já fiz a chamada da api");
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  beforeMount: function() {
    this.getItems();
  }
};
</script>
