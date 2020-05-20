<template>
    <div>
        <v-list rounded>

        <v-list-item class="px-2" v-if="this.$store.state.user!=null">
            <v-list-item-avatar>
                <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
            </v-list-item-avatar>
            <v-list-item-title>{{this.$store.state.user.name}}</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

            <v-list-item class="px-2" to="/dashboard">
                <v-list-item-icon>
                    <v-icon>mdi-home-city</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Dashboard</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item class="px-2" to="/myProfile">
                <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>My Profile</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item class="px-2" to="/addProduct" v-if="canAccessAddProduct">
                <v-list-item-icon>
                    <v-icon>mdi-account-group-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Add Product</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item class="px-2" to="/managerProducts">
                <v-list-item-icon>
                    <v-icon>mdi-corn</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>My Products</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

    </div>
</template>

<script>
    export default {
        data() {
            return{

            }
        },
      computed:{
        canAccessAddProduct(){
          if(this.$store.state.user) {
            if (this.$store.state.user.role === 'producer' || this.$store.state.user.role === 'retailer') {
              return true;
            }
          }
          return false;
        },
      }
    }
</script>