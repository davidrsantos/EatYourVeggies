<template>
    <div>

        <li :key="item.recordId" v-for="item in items">
            {{item.recordId}}

        </li>

        <li :key="agent.key" v-for="agent in agents">
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

            agents: []
        }),
        methods: {
            getItems() {
                axios.get('/records?recordType=fish').then(response => {
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
        beforeMount: function () {
            this.getItems();
        }
    };
</script>
