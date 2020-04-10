<template>
  <div class="home">
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
          this.items = response.data[0].name;
          console.log("já fiz a chamada da api");
          console.log(response)
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
