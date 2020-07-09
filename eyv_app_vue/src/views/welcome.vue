<template>
    <span>
        <v-container
            class="home-hero"
            fill-height
            fluid
            style="max-height: 100vh;"
        >
            <v-layout align-center column justify-center pa-5>
                <div
                    class="display-4 font-weight-black white--text text-xs-center"
                >
                    Welcome to Eat Your Veggies
                </div>
                <div
                    class="display-1 font-weight-bold white--text text-xs-center"
                >
                    Check the available products in our platform
                </div>
                <div class="arrow" v-scroll-to="'#managerProducts'">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </v-layout>
        </v-container>
        <manager-products
            class="mb-12 "
            id="managerProducts"
        ></manager-products>
    </span>
</template>
<script>
export default {
    name: 'welcome',
    beforeCreate() {
        this.$store.commit('setViewer', true);
    }
};
</script>
<style>
.home-hero {
    background: url('../assets/background.jpg');
    background-size: cover;
    width: 100%;
    height: 100%;
}

.arrow {
    position: relative;
    top: 15%;

    transform: translate(-50%, -50%);
}

.arrow span {
    display: block;
    width: 50px;
    height: 50px;
    border-bottom: 5px solid #4cba11;
    border-right: 5px solid #4cba11;
    transform: rotate(45deg);
    margin: -10px;
    animation: animate 2s infinite;
}

.arrow span:nth-child(2) {
    animation-delay: -0.2s;
}

.arrow span:nth-child(3) {
    animation-delay: -0.4s;
}

@keyframes animate {
    0% {
        opacity: 0;
        transform: rotate(45deg) translate(-20px, -20px);
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: rotate(45deg) translate(20px, 20px);
    }
}
</style>
