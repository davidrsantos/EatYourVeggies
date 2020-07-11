<template>
    <div>
        <v-list-item class="px-2" v-if="this.$store.state.user != null">
            <v-list-item-avatar>
                <v-icon color="teal" x-large>mdi-account-circle</v-icon>
            </v-list-item-avatar>

            <v-list-item-title>{{
                this.$store.state.user.name
            }}</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list rounded>
            <v-list-item
                :key="item.title"
                :to="item.link"
                class="px-2"
                link
                v-for="item in items"
            >
                <v-list-item-icon>
                    <v-icon color="green darken-2">{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </div>
</template>

<script>
export default {
    data() {
        return {
            drawer: true,
            items: [],
            itemsForCustomer: [
                {
                    title: 'Dashboard',
                    icon: 'mdi-home-city',
                    link: '/dashboard'
                },
                { title: 'My Products', icon: 'mdi-corn', link: '/products' },
                { title: 'My Profile', icon: 'mdi-account', link: '/myProfile' }
            ],
            itemsForDistributor: [
                {
                    title: 'Dashboard',
                    icon: 'mdi-home-city',
                    link: '/dashboard'
                },
                {
                    title: 'My Profile',
                    icon: 'mdi-account',
                    link: '/myProfile'
                },
                { title: 'My Products', icon: 'mdi-corn', link: '/products' }
            ],
            itemsForProducer: [
                {
                    title: 'Dashboard',
                    icon: 'mdi-home-city',
                    link: '/dashboard'
                },
                {
                    title: 'My Profile',
                    icon: 'mdi-account',
                    link: '/myProfile'
                },
                { title: 'My Products', icon: 'mdi-corn', link: '/products' },
                {
                    title: 'Add Product',
                    icon: 'mdi-plus-circle',
                    link: '/products/new'
                }
            ],
            itemsForRetailer: [
                {
                    title: 'Dashboard',
                    icon: 'mdi-home-city',
                    link: '/dashboard'
                },
                {
                    title: 'My Profile',
                    icon: 'mdi-account',
                    link: '/myProfile'
                },
                { title: 'My Products', icon: 'mdi-corn', link: '/products' }
            ],
            itemsForAdmin: [
                {
                    title: 'Dashboard',
                    icon: 'mdi-home-city',
                    link: '/dashboard'
                },
                {
                    title: 'My Profile',
                    icon: 'mdi-account',
                    link: '/myProfile'
                },
                { title: 'Products', icon: 'mdi-corn', link: '/products' },
                {
                    title: 'Add Product',
                    icon: 'mdi-plus-circle',
                    link: '/products/new'
                }
            ],

            mini: true
        };
    },
    created: function() {
        if (this.$store.state.user) {
            switch (this.$store.state.user.role) {
                case 'producer':
                    this.items = this.itemsForProducer;
                    break;
                case 'distributor':
                    this.items = this.itemsForDistributor;
                    break;
                case 'retailer':
                    this.items = this.itemsForRetailer;
                    break;
                case 'customer':
                    this.items = this.itemsForCustomer;
                    break;
                case 'admin':
                    this.items = this.itemsForAdmin;
                    break;
            }
        }
    }
};
</script>
