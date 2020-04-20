<template>
  <div>
    <li v-for="item in items" :key="item.recordId">
      {{ item.recordId }}
    </li>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data: () => ({
    items: [],
  }),
  methods: {
    getItems() {
      axios
        .get("/records?recordType=vegetable")
        .then((response) => {
          this.items = response.data;
          console.log("já fiz a chamada da api");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  beforeMount: function() {
    this.getItems();
  },
};
</script>
