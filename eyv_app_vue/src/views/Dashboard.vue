<template>
    <div>
        <list-users v-show="this.$store.state.user!=null && this.$store.state.user.role ==='admin'"></list-users>
        <proposals v-show="this.$store.state.user!=null"></proposals>

there you go! list of vegetables:


        <li :key="item.recordId" v-for="item in items">
            {{item.recordId}}

        </li>
and some agents to see:
        <li :key="agent.publicKey" v-for="agent in agents">
            {{agent.name}}

        </li>


    </div>
</template>

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
               /* axios.get('/records?recordType=vegetable').then(response => {
                    this.items = response.data;
                })
                    .catch(function (error) {
                        console.log(error);
                    });
                axios.get('/agents').then(response => {
                    this.agents = response.data;
                })
                    .catch(function (error) {
                        console.log(error);
                    });*/
            }
        },
        created () {
            this.getItems();
            this.timer = setInterval(this.getItems, 300000)
        },

    };
</script>
