<template>
    <div></div>
</template>
there you go! list of vegetables:


<li :key="item.recordId" v-for="item in items">
    {{item.recordId}}

</li>
and some agents to see:
<li :key="agent.key" v-for="agent in agents">
    {{agent.name}}

</li>




<script>
    // @ is an alias to /src

    export default {
        name: "Home",
        data: () => ({
            items: [],
            timer: '',

            agents: []
        }),
        methods: {
            getItems() {
                axios.get('/records?recordType=vegetable').then(response => {
                    this.items = response.data;
                    console.log("já fiz a chamada da api");
                })
                    .catch(function (error) {
                        console.log(error);
                    });
                axios.get('/agents').then(response => {
                    this.agents = response.data;
                    console.log("já fiz a chamada da api");
                })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        created () {
            this.getItems();
            this.timer = setInterval(this.getItems, 300000)
        },

    };
</script>
