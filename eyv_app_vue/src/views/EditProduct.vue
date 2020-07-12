<template>
    <v-container>
        <v-sheet class="px-2 pt-1 pb-40" color="lighten-4" v-if="loading">
            <v-row>
                <v-skeleton-loader
                        class="mx-auto my-2"
                        type="image,actions"
                        width="1000"
                ></v-skeleton-loader
                >
            </v-row>
            <v-row no-gutters>
                <v-skeleton-loader
                        class="mx-auto my-2"
                        type="list-item,list-item,list-item,list-item,list-item,list-item,list-item,list-item,list-item"
                        width="700"
                ></v-skeleton-loader>
            </v-row>
        </v-sheet>

        <v-container :loading="loading" v-else>
            <v-card class="mx-auto mt-5">
                <v-toolbar color="green" dark flat>
                    <v-toolbar-title class="mr-2"
                    >Product Batch:
                    </v-toolbar-title
                    >

                    <v-toolbar-title class="font-weight-bold">{{
                        product.recordId
                        }}
                    </v-toolbar-title>
                </v-toolbar>
                <v-container>
                    <v-card v-if="product.final">
                        <v-sheet class="text-center" color="red" dark
                        >Finished Product
                        </v-sheet
                        >
                        <v-card-text>
                            <v-text-field
                                    :value="product.finalizeJustification"
                                    label="Finalize Justification"
                                    outlined
                                    readonly
                            />
                        </v-card-text>
                    </v-card>
                    <v-row>
                        <v-img
                                :src="
                                'http://localhost:8020/image/' +
                                    product.recordId
                            "
                                class="ma-4"
                                contain
                                height="250"
                        ></v-img>

                        <v-container
                                fluid
                                v-if="
                                this.$store.state.user &&
                                    this.$store.state.user.role !==
                                        'customer' &&
                                    !product.final &&
                                    !product.proposals.length &&
                                    product.owner ===
                                        this.$store.state.user.publicKey
                            "
                        >
                            <v-row align="center" justify="center">
                                <v-btn
                                        @click="openTransferDialog"
                                        class="ml-2"
                                        color="green darken-3"
                                        dark
                                        v-if="!product.proposals.length"
                                >Transfer Ownership
                                </v-btn>
                                <v-btn
                                        @click="dialogGenerateSubProduct = true"
                                        class="ml-2"
                                        color="green darken-3"
                                        dark
                                        v-if="
                                        this.$store.state.user.role ===
                                            'admin' ||
                                            this.$store.state.user.role ===
                                                'producer' ||
                                            this.$store.state.user.role ===
                                                'retailer'
                                    "
                                >
                                    Generate Sub-Product
                                </v-btn>
                                <v-btn
                                        @click="
                                        openDialog(
                                            justification,
                                            'finalize',
                                            'the reason why you want to finalize'
                                        )
                                    "
                                        class="ml-2"
                                        color="red accent-4"
                                        dark
                                >
                                    Finalize Product
                                </v-btn>
                            </v-row>
                        </v-container>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-card>
                                <v-container fluid>
                                    <v-card-title
                                    >Product Information
                                    </v-card-title
                                    >
                                    <v-card-text>
                                        <v-row>
                                            <v-col>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Name
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                        openDialog(
                                                            product.name,
                                                            'name',
                                                            'Name'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state
                                                            .user &&
                                                            this.$store.state
                                                                .user.role !==
                                                                'customer' &&
                                                            !product.final &&
                                                            !product.proposals
                                                                .length &&
                                                            product.owner ===
                                                                this.$store
                                                                    .state.user
                                                                    .publicKey
                                                    "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                        callRoutePropertyDetails(
                                                            product.recordId,
                                                            'name'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state.user
                                                            .role !== 'admin' ||
                                                        this.$store.state.user
                                                            .role == null
                                                            ? ''
                                                            : 'mdi-history'
                                                    "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            :value="product.name"
                                                            outlined
                                                            readonly
                                                    />
                                                </v-container>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Classification
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                        openDialog(
                                                            product.classification,
                                                            'classification',
                                                            'Classification'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state
                                                            .user &&
                                                            this.$store.state
                                                                .user.role !==
                                                                'customer' &&
                                                            !product.final &&
                                                            !product.proposals
                                                                .length &&
                                                            product.owner ===
                                                                this.$store
                                                                    .state.user
                                                                    .publicKey
                                                    "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                        callRoutePropertyDetails(
                                                            product.recordId,
                                                            'classification'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state.user
                                                            .role !== 'admin' ||
                                                        this.$store.state.user
                                                            .role == null
                                                            ? ''
                                                            : 'mdi-history'
                                                    "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            :value="
                                                        product.classification
                                                    "
                                                            outlined
                                                            readonly
                                                    />
                                                </v-container>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Origin
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                        openDialog(
                                                            product.origin,
                                                            'origin',
                                                            'Origin'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state
                                                            .user &&
                                                            this.$store.state
                                                                .user.role !==
                                                                'customer' &&
                                                            !product.final &&
                                                            !product.proposals
                                                                .length &&
                                                            product.owner ===
                                                                this.$store
                                                                    .state.user
                                                                    .publicKey
                                                    "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                        callRoutePropertyDetails(
                                                            product.recordId,
                                                            'origin'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state.user
                                                            .role !== 'admin' ||
                                                        this.$store.state.user
                                                            .role == null
                                                            ? ''
                                                            : 'mdi-history'
                                                    "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            :value="product.origin"
                                                            outlined
                                                            readonly
                                                    />
                                                </v-container>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Cultivation
                                                        Process
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                        openDialog(
                                                            product.cultivationProcess,
                                                            'cultivationProcess',
                                                            'Cultivation Process'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state
                                                            .user &&
                                                            this.$store.state
                                                                .user.role !==
                                                                'customer' &&
                                                            !product.final &&
                                                            !product.proposals
                                                                .length &&
                                                            product.owner ===
                                                                this.$store
                                                                    .state.user
                                                                    .publicKey
                                                    "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                        callRoutePropertyDetails(
                                                            product.recordId,
                                                            'cultivationProcess'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state.user
                                                            .role !== 'admin' ||
                                                        this.$store.state.user
                                                            .role == null
                                                            ? ''
                                                            : 'mdi-history'
                                                    "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            :value="
                                                        product.cultivationProcess
                                                    "
                                                            outlined
                                                            readonly
                                                    />
                                                </v-container>
                                            </v-col>
                                            <v-col>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Size (cm)
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                        openDialog(
                                                            product.size,
                                                            'size',
                                                            'Size (cm)'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state
                                                            .user &&
                                                            this.$store.state
                                                                .user.role !==
                                                                'customer' &&
                                                            !product.final &&
                                                            !product.proposals
                                                                .length &&
                                                            product.owner ===
                                                                this.$store
                                                                    .state.user
                                                                    .publicKey
                                                    "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                        callRoutePropertyDetails(
                                                            product.recordId,
                                                            'size'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state.user
                                                            .role !== 'admin' ||
                                                        this.$store.state.user
                                                            .role == null
                                                            ? ''
                                                            : 'mdi-history'
                                                    "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            :value="product.size"
                                                            outlined
                                                            readonly
                                                    />
                                                </v-container>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Weight
                                                        (grams)
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                        openDialog(
                                                            product.weight,
                                                            'weight',
                                                            'Weight (grams)'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state
                                                            .user &&
                                                            this.$store.state
                                                                .user.role !==
                                                                'customer' &&
                                                            !product.final &&
                                                            !product.proposals
                                                                .length &&
                                                            product.owner ===
                                                                this.$store
                                                                    .state.user
                                                                    .publicKey
                                                    "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                        callRoutePropertyDetails(
                                                            product.recordId,
                                                            'weight'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state.user
                                                            .role !== 'admin' ||
                                                        this.$store.state.user
                                                            .role == null
                                                            ? ''
                                                            : 'mdi-history'
                                                    "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            :value="product.weight"
                                                            outlined
                                                            readonly
                                                    />
                                                </v-container>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Harvest
                                                        Date
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                        openDialog(
                                                            product.harvestDate,
                                                            'harvestDate',
                                                            'Harvest Date'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state
                                                            .user &&
                                                            this.$store.state
                                                                .user.role !==
                                                                'customer' &&
                                                            !product.final &&
                                                            !product.proposals
                                                                .length &&
                                                            product.owner ===
                                                                this.$store
                                                                    .state.user
                                                                    .publicKey
                                                    "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                        callRoutePropertyDetails(
                                                            product.recordId,
                                                            'harvestDate'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state.user
                                                            .role !== 'admin' ||
                                                        this.$store.state.user
                                                            .role == null
                                                            ? ''
                                                            : 'mdi-history'
                                                    "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            :value="product.harvestDate"
                                                            outlined
                                                            readonly
                                                    />
                                                </v-container>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Expiration
                                                        Date
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                        openDialog(
                                                            product.expirationDate,
                                                            'expirationDate',
                                                            'Expiration Date'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state
                                                            .user &&
                                                            this.$store.state
                                                                .user.role !==
                                                                'customer' &&
                                                            !product.final &&
                                                            !product.proposals
                                                                .length &&
                                                            product.owner ===
                                                                this.$store
                                                                    .state.user
                                                                    .publicKey
                                                    "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                        callRoutePropertyDetails(
                                                            product.recordId,
                                                            'expirationDate'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state.user
                                                            .role !== 'admin' ||
                                                        this.$store.state.user
                                                            .role == null
                                                            ? ''
                                                            : 'mdi-history'
                                                    "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            :value="
                                                        product.expirationDate ==
                                                        null
                                                            ? 'N/A'
                                                            : product.expirationDate
                                                    "
                                                            outlined
                                                            readonly
                                                    />
                                                </v-container>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Packing
                                                        Date
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                        openDialog(
                                                            product.packingDate,
                                                            'packingDate',
                                                            'Packing Date'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state
                                                            .user &&
                                                            this.$store.state
                                                                .user.role !==
                                                                'customer' &&
                                                            !product.final &&
                                                            !product.proposals
                                                                .length &&
                                                            product.owner ===
                                                                this.$store
                                                                    .state.user
                                                                    .publicKey
                                                    "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                        callRoutePropertyDetails(
                                                            product.recordId,
                                                            'packingDate'
                                                        )
                                                    "
                                                            icon
                                                            v-if="
                                                        this.$store.state.user
                                                            .role !== 'admin' ||
                                                        this.$store.state.user
                                                            .role == null
                                                            ? ''
                                                            : 'mdi-history'
                                                    "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            :value="
                                                        product.packingDate ==
                                                        null
                                                            ? 'N/A'
                                                            : product.packingDate
                                                    "
                                                            outlined
                                                            readonly
                                                    />
                                                </v-container>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-container>
                            </v-card>
                        </v-col>
                        <v-col cols="6">

                            <v-card >
                                <v-container fluid>
                                    <v-card-title
                                    >Product Properties
                                    </v-card-title
                                    >
                                    <v-card-text>
                                        <v-row>
                                            <v-col>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Temperature ºC
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                    openDialog(
                                                        product.temperature,
                                                        'temperature',
                                                        'Temperature ºC'
                                                    )
                                                "
                                                            icon
                                                            v-if="
                                                    this.$store.state.user &&
                                                        this.$store.state.user
                                                            .role !==
                                                            'customer' &&
                                                        !product.final &&
                                                        !product.proposals
                                                            .length &&
                                                        product.owner ===
                                                            this.$store.state
                                                                .user.publicKey
                                                "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                    callRoutePropertyDetails(
                                                        product.recordId,
                                                        'temperature'
                                                    )
                                                "
                                                            icon
                                                            v-if="
                                                    this.$store.state.user
                                                        .role == 'customer' ||
                                                    this.$store.state.user
                                                        .role == null
                                                        ? ''
                                                        : 'mdi-history'
                                                "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            outlined
                                                            readonly
                                                            v-model="
                                                    product.temperature == null
                                                        ? 'N/A'
                                                        : product.temperature
                                                "
                                                    />
                                                </v-container>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Humidity kg/m³
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                    openDialog(
                                                        product.humidity,
                                                        'humidity',
                                                        'Humidity kg/m³'
                                                    )
                                                "
                                                            icon
                                                            v-if="
                                                    this.$store.state.user &&
                                                        this.$store.state.user
                                                            .role !==
                                                            'customer' &&
                                                        !product.final &&
                                                        !product.proposals
                                                            .length &&
                                                        product.owner ===
                                                            this.$store.state
                                                                .user.publicKey
                                                "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                    callRoutePropertyDetails(
                                                        product.recordId,
                                                        'humidity'
                                                    )
                                                "
                                                            icon
                                                            v-if="
                                                    this.$store.state.user
                                                        .role == 'customer' ||
                                                    this.$store.state.user
                                                        .role == null
                                                        ? ''
                                                        : 'mdi-history'
                                                "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            outlined
                                                            readonly
                                                            v-model="
                                                    product.humidity == null
                                                        ? 'N/A'
                                                        : product.humidity
                                                "
                                                    />
                                                </v-container>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >CO2
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                    openDialog(
                                                        product.humidity,
                                                        'co2',
                                                        'CO2'
                                                    )
                                                "
                                                            icon
                                                            v-if="
                                                    this.$store.state.user &&
                                                        this.$store.state.user
                                                            .role !==
                                                            'customer' &&
                                                        !product.final &&
                                                        !product.proposals
                                                            .length &&
                                                        product.owner ===
                                                            this.$store.state
                                                                .user.publicKey
                                                "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                    callRoutePropertyDetails(
                                                        product.recordId,
                                                        'co2'
                                                    )
                                                "
                                                            icon
                                                            v-if="
                                                    this.$store.state.user
                                                        .role == 'customer' ||
                                                    this.$store.state.user
                                                        .role == null
                                                        ? ''
                                                        : 'mdi-history'
                                                "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            outlined
                                                            readonly
                                                            v-model="
                                                    product.co2 == null
                                                        ? 'N/A'
                                                        : product.co2
                                                "
                                                    />
                                                </v-container>

                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Shock
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                    openShockDialog(
                                                        product.acceleration,
                                                        product.duration,
                                                        'acceleration',
                                                        'duration'
                                                    )
                                                "
                                                            icon
                                                            v-if="
                                                    this.$store.state.user &&
                                                        this.$store.state.user
                                                            .role !==
                                                            'customer' &&
                                                        !product.final &&
                                                        !product.proposals
                                                            .length &&
                                                        product.owner ===
                                                            this.$store.state
                                                                .user.publicKey
                                                "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                    callRoutePropertyDetails(
                                                        product.recordId,
                                                        'shock'
                                                    )
                                                "
                                                            icon
                                                            v-if="
                                                    this.$store.state.user
                                                        .role == 'customer' ||
                                                    this.$store.state.user
                                                        .role == null
                                                        ? ''
                                                        : 'mdi-history'
                                                "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            label="Acceleration"
                                                            outlined
                                                            readonly
                                                            v-model="
                                                    product.acceleration == null
                                                        ? 'N/A'
                                                        : product.acceleration
                                                "
                                                    />

                                                    <v-text-field
                                                            label="Duration"
                                                            outlined
                                                            readonly
                                                            v-model="
                                                    product.duration == null
                                                        ? 'N/A'
                                                        : product.duration
                                                "
                                                    />
                                                </v-container>
                                            </v-col>
                                            <v-col>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Tilt
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                    openTiltDialog(
                                                        product.tiltX,
                                                        product.tiltY,
                                                        'tiltX',
                                                        'tiltY'
                                                    )
                                                "
                                                            icon
                                                            v-if="
                                                    this.$store.state.user &&
                                                        this.$store.state.user
                                                            .role !==
                                                            'customer' &&
                                                        !product.final &&
                                                        !product.proposals
                                                            .length &&
                                                        product.owner ===
                                                            this.$store.state
                                                                .user.publicKey
                                                "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                    callRoutePropertyDetails(
                                                        product.recordId,
                                                        'tilt'
                                                    )
                                                "
                                                            icon
                                                            v-if="
                                                    this.$store.state.user
                                                        .role == 'customer' ||
                                                    this.$store.state.user
                                                        .role == null
                                                        ? ''
                                                        : 'mdi-history'
                                                "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            label="X"
                                                            outlined
                                                            readonly
                                                            v-model="
                                                    product.tiltX == null
                                                        ? 'N/A'
                                                        : product.tiltX
                                                "
                                                    />
                                                    <v-text-field
                                                            label="Y"
                                                            outlined
                                                            readonly
                                                            v-model="
                                                    product.tiltY == null
                                                        ? 'N/A'
                                                        : product.tiltY
                                                "
                                                    />
                                                </v-container>
                                                <v-toolbar color="green" dark dense>
                                                    <v-toolbar-title
                                                    >Localization
                                                    </v-toolbar-title
                                                    >
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                            @click="
                                                    openLocalizationDialog(
                                                        product.latitude,
                                                        product.longitude,
                                                        'latitude',
                                                        'longitude'
                                                    )
                                                "
                                                            icon
                                                            v-if="
                                                    this.$store.state.user &&
                                                        this.$store.state.user
                                                            .role !==
                                                            'customer' &&
                                                        !product.final &&
                                                        !product.proposals
                                                            .length &&
                                                        product.owner ===
                                                            this.$store.state
                                                                .user.publicKey
                                                "
                                                    >
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn
                                                            @click="
                                                    callRoutePropertyDetails(
                                                        product.recordId,
                                                        'location'
                                                    )
                                                "
                                                            icon
                                                            v-if="
                                                    this.$store.state.user
                                                        .role == 'customer' ||
                                                    this.$store.state.user
                                                        .role == null
                                                        ? ''
                                                        : 'mdi-history'
                                                "
                                                    >
                                                        <v-icon>mdi-history</v-icon>
                                                    </v-btn>
                                                </v-toolbar>
                                                <v-container>
                                                    <v-text-field
                                                            label="Latitude"
                                                            outlined
                                                            readonly
                                                            v-model="product.latitude"
                                                    />
                                                    <v-text-field
                                                            label="Longitude"
                                                            outlined
                                                            readonly
                                                            v-model="product.longitude"
                                                    />
                                                </v-container>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-container>

        <!--Dialogs-->
        <v-dialog max-width="600" v-model="dialogTransfer">
            <v-card fluid>
                <v-container>
                    <v-select
                            :items="users"
                            :menu-props="{ top: true, offsetY: true }"
                            item-text="name"
                            item-value="publicKey"
                            label="Select User"
                            outlined
                            v-model="publicKey"
                    ></v-select>

                    <v-card-actions class="justify-center">
                        <v-btn @click="cancel" color="grey darken-1">
                            Cancel
                        </v-btn>
                        <v-btn
                                @click="submit"
                                class="mr-4 ml-4"
                                color="green darken-1"
                        >Transfer
                        </v-btn
                        >
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

        <v-dialog max-width="600" v-model="dialogProperties">
            <v-card>
                <v-container>
                    <v-card-title class="headline"
                    >Insert {{ dialogLabel }}:
                    </v-card-title
                    >
                    <v-menu
                            :close-on-content-click="false"
                            :nudge-right="40"
                            min-width="290px"
                            offset-y
                            transition="scale-transition"
                            v-if="
                            key == 'harvestDate' ||
                                key == 'packingDate' ||
                                key == 'expirationDate'
                        "
                            v-model="menuDate"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                    :error-messages="keyErrors"
                                    @blur="$v.valueUpdate.$touch()"
                                    @input="$v.valueUpdate.$touch()"
                                    readonly
                                    v-model="valueUpdate"
                                    v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                                @input="menuDate = false"
                                v-model="valueUpdate"
                        ></v-date-picker>
                    </v-menu>
                    <v-text-field
                            :error-messages="keyErrors"
                            @blur="$v.valueUpdate.$touch()"
                            @input="$v.valueUpdate.$touch()"
                            class="ml-4 mr-4"
                            v-else
                            v-model="valueUpdate"
                    />
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="cancelInsert" color="grey darken-1">
                            Cancel
                        </v-btn>
                        <v-btn
                                :disabled="submitStatus === 'ERROR'"
                                @click="submitProperty"
                                class="ml-4"
                                color="green darken-1"
                        >Insert
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog max-width="600" v-model="dialogTilt">
            <v-card>
                <v-container>
                    <v-card-title class="headline">Insert Tilt:</v-card-title>

                    <v-text-field
                            :error-messages="doublePropsErrors"
                            @blur="$v.tiltX.$touch()"
                            @input="$v.tiltX.$touch()"
                            class="ml-4 mr-4"
                            label="X"
                            v-model="tiltX"
                    />
                    <v-text-field
                            :error-messages="doublePropsErrors2"
                            @blur="$v.tiltY.$touch()"
                            @input="$v.tiltY.$touch()"
                            class="ml-4 mr-4"
                            label="Y"
                            v-model="tiltY"
                    />

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="cancelTiltInsert" color="grey darken-1">
                            Cancel
                        </v-btn>
                        <v-btn
                                :disabled="submitStatus === 'ERROR'"
                                @click="submitTilt"
                                class="ml-4"
                                color="green darken-1"
                        >Insert
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

        <v-dialog max-width="600" v-model="dialogShock">
            <v-card>
                <v-container>
                    <v-card-title class="headline">Insert Shock:</v-card-title>
                    <v-text-field
                            :error-messages="doublePropsErrors"
                            @blur="$v.acceleration.$touch()"
                            @input="$v.acceleration.$touch()"
                            class="ml-4 mr-4"
                            label="Acceleration"
                            v-model="acceleration"
                    />
                    <v-text-field
                            :error-messages="doublePropsErrors2"
                            @blur="$v.duration.$touch()"
                            @input="$v.duration.$touch()"
                            class="ml-4 mr-4"
                            label="Duration"
                            v-model="duration"
                    />
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="cancelShockInsert" color="grey darken-1">
                            Cancel
                        </v-btn>
                        <v-btn
                                :disabled="submitStatus === 'ERROR'"
                                @click="submitShock"
                                class="ml-4"
                                color="green darken-1"
                        >Insert
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

        <v-dialog max-width="600" v-model="dialogLocalization">
            <v-card>
                <v-container>
                    <v-card-title class="headline"
                    >Insert Localization:
                    </v-card-title
                    >
                    <v-text-field
                            :error-messages="doublePropsErrors"
                            @blur="$v.latitude.$touch()"
                            @input="$v.latitude.$touch()"
                            class="ml-4 mr-4"
                            label="X"
                            v-model="latitude"
                    />
                    <v-text-field
                            :error-messages="doublePropsErrors2"
                            @blur="$v.longitude.$touch()"
                            @input="$v.longitude.$touch()"
                            class="ml-4 mr-4"
                            label="Y"
                            v-model="longitude"
                    />
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                @click="cancelLocalizationInsert"
                                color="grey darken-1"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                                :disabled="submitStatus === 'ERROR'"
                                @click="submitLocalization"
                                class="ml-4"
                                color="green darken-1"
                        >Insert
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogGenerateSubProduct">
            <divide-product
                    :product="product"
                    @close="closeDialogGenerateSubProduct"
                    @requestPasswordEvent="$emit('requestPasswordEvent')"
            />
        </v-dialog>
    </v-container>
</template>

<script>
  import { getPropertyValue } from '../utils/records'
  import * as api from '../services/api'
  import * as parsing from '../services/parsing'
  import {
    email,
    maxLength,
    minLength,
    numeric,
    between,
    decimal,
    required,
    sameAs,
    alphaNum,
    minValue
  } from 'vuelidate/lib/validators'

  const payloads = require('../services/payloads')
  const transactions = require('../services/transactions')

  export default {
    name: 'EditProduct',
    validations () {
      return {
        valueUpdate: this.rules,
        tiltX: {
          minLength: minLength(1),
          maxLength: maxLength(9),
          decimal
        },
        tiltY: {
          minLength: minLength(1),
          maxLength: maxLength(9),
          decimal
        },
        acceleration: {
          minLength: minLength(1),
          maxLength: maxLength(9),
          decimal
        },
        duration: {
          minLength: minLength(1),
          maxLength: maxLength(9),
          decimal
        },
        latitude: {
          minLength: minLength(1),
          maxLength: maxLength(9),
          decimal,
          between: between(-90, 90)
        },
        longitude: {
          minLength: minLength(1),
          maxLength: maxLength(9),
          decimal,
          between: between(-180, 180)
        }
      }
    },
    data: () => ({
      dialogGenerateSubProduct: false,
      loading: true,
      submitStatus: null,
      final: '',
      proposals: '',
      isOpen: false,
      menuDate: false,
      product: {
        final: '',
        batch: '',
        name: '',
        classification: '',
        origin: '',
        cultivationProcess: '',
        size: '',
        weight: '',
        harvestDate: '',
        expirationDate: '',
        packingDate: '',
        latitude: '',
        longitude: '',
        temperature: '',
        humidity: '',
        co2: '',
        acceleration: '',
        duration: '',
        tiltX: '',
        tiltY: '',
        finalizeJustification: ''
      },
      //value for update properties
      latitude: '',
      longitude: '',
      temperature: '',
      humidity: '',
      co2: '',
      acceleration: '',
      duration: '',
      tiltX: '',
      tiltY: '',
      justification: '',
      users: [],
      role: 'owner',
      publicKey: '',
      dialogTransfer: '',
      dialogLabel: '',
      dialogProperties: '',
      dialogTilt: '',
      dialogShock: '',
      dialogLocalization: '',
      valueUpdate: null,
      key: '',
      key1: '',
      key2: ''
    }),
    created: function () {
      if (this.$route.params.recordId != null) {
        this.recordId = this.$route.params.recordId
      }
    },
    methods: {
      callRoutePropertyDetails (recordId, name) {
        this.$router.push('/products/' + recordId + '/property/' + name)
      },

      handleErrors (error) {
        this.$emit('errorEvent', error)
      },
      filterUserRole (users) {
        let role = this.$store.state.user.role

        if (role == 'admin') {
          this.users = users
        } else if (role == 'distributor') {
          this.users = users.filter(function (user) {
            return user.role == 'retailer'
          })
        } else if (role == 'retailer') {
          this.users = users.filter(function (user) {
            return user.role == 'customer'
          })
        } else if (role == 'producer') {
          this.users = users.filter(function (user) {
            return user.role == 'distributor'
          })
        }
      },
      getUsers () {
        axios
          .get('/agents')
          .then(response => {
            this.filterUserRole(response.data)
          })
          .catch(error => {
            this.$emit('errorEvent', error.response.data.error)
          })
      },

      getPropertyValue (item, prop) {
        return getPropertyValue(item, prop)
      },
      getProduct () {
        this.loading = true
        axios
          .get(`/records/${this.recordId}`)
          .then(response => {
            this.product = response.data
            this.loading = false
            let final = getPropertyValue(response.data, 'final')
            if (final !== null) {
              this.product.final = final
            }
            let finalizeJustification = getPropertyValue(
              response.data,
              'finalizeJustification'
            )
            if (finalizeJustification !== null) {
              this.product.finalizeJustification = finalizeJustification
            }
            let name = getPropertyValue(response.data, 'name')
            if (name !== null) {
              this.product.name = name
            }
            let classification = getPropertyValue(
              response.data,
              'classification'
            )
            if (name !== null) {
              this.product.classification = classification
            }
            let origin = getPropertyValue(response.data, 'origin')
            if (origin !== null) {
              this.product.origin = origin
            }
            let cultivationProcess = getPropertyValue(
              response.data,
              'cultivationProcess'
            )
            if (cultivationProcess !== null) {
              this.product.cultivationProcess = cultivationProcess
            }
            let size = getPropertyValue(response.data, 'size')
            if (size !== null) {
              this.product.size = parsing.toFloat(size)
            }
            let weight = getPropertyValue(response.data, 'weight')
            if (weight !== null) {
              this.product.weight = parsing.toFloat(weight)
            }
            let harvestDate = getPropertyValue(
              response.data,
              'harvestDate'
            )
            if (harvestDate !== null) {
              var date = new Date(harvestDate * 1000)
              this.product.harvestDate = date
                .toISOString()
                .substr(0, 10)
            }
            let expirationDate = getPropertyValue(
              response.data,
              'expirationDate'
            )
            if (expirationDate !== null) {
              var date1 = new Date(expirationDate * 1000)
              this.product.expirationDate = date1
                .toISOString()
                .substr(0, 10)
            }
            let packingDate = getPropertyValue(
              response.data,
              'packingDate'
            )
            if (packingDate !== null) {
              var date2 = new Date(packingDate * 1000)
              this.product.packingDate = date2
                .toISOString()
                .substr(0, 10)
            }
            let temperature = getPropertyValue(
              response.data,
              'temperature'
            )
            if (temperature !== null) {
              this.product.temperature = parsing.toFloat(temperature)
            }
            let humidity = getPropertyValue(response.data, 'humidity')
            if (humidity !== null) {
              this.product.humidity = parsing.toFloat(humidity)
            }
            let co2 = getPropertyValue(response.data, 'co2')
            if (co2 !== null) {
              this.product.co2 = parsing.toFloat(co2)
            }
            let location = getPropertyValue(response.data, 'location')
            if (location !== null) {
              this.product.latitude = parsing.toFloat(
                location.latitude
              )
              this.product.longitude = parsing.toFloat(
                location.longitude
              )
            }
            let tilt = getPropertyValue(response.data, 'tilt')
            if (tilt !== null) {
              tilt = JSON.parse(tilt)
              this.product.tiltX = parsing.toFloat(tilt.x)
              this.product.tiltY = parsing.toFloat(tilt.y)
            }
            let shock = getPropertyValue(response.data, 'shock')
            if (shock !== null) {
              shock = JSON.parse(shock)
              this.product.acceleration = parsing.toFloat(
                shock.accel
              )
              this.product.duration = parsing.toFloat(shock.duration)
            }
          })
          .catch(error => {
            this.$emit('errorEvent', error.response.data.error)
            this.loading = false
          })
      },
      updateProperty (record, value) {
        if (
          this.key == 'expirationDate' &&
          new Date(this.valueUpdate).getTime() <
          new Date(this.product.harvestDate).getTime()
        ) {
          this.$emit(
            'errorEvent',
            'The expiration date cannot be less than the harvest date'
          )
        } else if (
          this.key == 'packingDate' &&
          this.valueUpdate < this.product.harvestDate
        ) {
          this.$emit(
            'errorEvent',
            'The packing date cannot be less than the harvest date'
          )
        } else if (
          this.key == 'packingDate' &&
          this.product.expirationDate !== null &&
          this.valueUpdate < this.product.expirationDate
        ) {
          this.$emit(
            'errorEvent',
            'The packing date cannot be less than the expiration date'
          )
        } else {
          let updatePayload = payloads.updateProperties({
            recordId: record,
            properties: [value]
          })
          this.$snotify.async(
            'Updating property in the blockchain',
            'Updating Property',
            () => {
              return new Promise((resolve, reject) => {
                return transactions
                  .submit([updatePayload], true)
                  .then(response => {
                    if (
                      response.status &&
                      response.type === undefined
                    ) {
                      setTimeout(
                        () =>
                          resolve({
                            title: 'Success',
                            body:
                              'Successfully updated property',
                            config: {
                              showProgressBar: true,
                              closeOnClick: true,
                              timeout: 8000
                            }
                          }),
                        2000
                      )
                      if (
                        value.name ==
                        'finalizeJustification'
                      ) {
                        this.finalizeProductSubmit()
                      } else {
                        this.getProduct()
                      }
                    }
                  })
                  .catch(error => {
                    if (error === 'requestPassword') {
                      this.$emit('requestPasswordEvent')
                      reject({
                        title: 'Error',
                        body: '',
                        icon: false,
                        config: {
                          timeout: 1
                        }
                      })
                    } else {
                      console.error(error)
                      setTimeout(
                        () =>
                          reject({
                            title: 'Error',
                            body: error,
                            config: {
                              showProgressBar: true,
                              closeOnClick: true,
                              timeout: 8000
                            }
                          }),
                        2000
                      )
                    }
                  })
              })
            }
          )
        }
      },
      finalizeProduct () {
        this.updateProperty(this.recordId, {
          name: 'finalizeJustification',
          stringValue: this.valueUpdate,
          dataType: payloads.updateProperties.enum.STRING
        })
      },
      finalizeProductSubmit () {
        let finalizePayload = payloads.finalizeRecord({
          recordId: this.recordId
        })
        this.$snotify.async(
          'Finalize product in the blockchain',
          'Finalize Product',
          () => {
            return new Promise((resolve, reject) => {
              return transactions
                .submit([finalizePayload], true)
                .then(response => {
                  if (
                    response.status &&
                    response.type === undefined
                  ) {
                    setTimeout(
                      () =>
                        resolve({
                          title: 'Success',
                          body:
                            'Successfully finalize product',
                          config: {
                            showProgressBar: true,
                            closeOnClick: true,
                            timeout: 8000
                          }
                        }),
                      2000
                    )
                    this.getProduct()
                  }
                })
                .catch(error => {
                  if (error === 'requestPassword') {
                    this.$emit('requestPasswordEvent')
                    reject({
                      title: 'Error',
                      body: '',
                      icon: false,
                      config: {
                        timeout: 1
                      }
                    })
                  } else {
                    console.error(error)
                    setTimeout(
                      () =>
                        reject({
                          title: 'Error',
                          body: error,
                          config: {
                            showProgressBar: true,
                            closeOnClick: true,
                            timeout: 8000
                          }
                        }),
                      2000
                    )
                  }
                })
            })
          }
        )
      },
      cancel () {
        this.dialogTransfer = false
      },
      cancelInsert () {
        this.dialogProperties = false
      },
      cancelTiltInsert () {
        this.dialogTilt = false
      },
      cancelShockInsert () {
        this.dialogShock = false
      },
      cancelLocalizationInsert () {
        this.dialogLocalization = false
      },
      submitProposal (recordId, role, publicKey) {
        let transferPayload = payloads.createProposal({
          recordId: recordId,
          receivingAgent: publicKey,
          role: this.roleToEnum(role)
        })
        this.$snotify.async(
          'Working on your proposal...',
          'Sending Proposal',
          () => {
            return new Promise((resolve, reject) => {
              return transactions
                .submit([transferPayload], true)
                .then(response => {
                  this.getProduct()
                  if (
                    response.status &&
                    response.type === undefined
                  ) {
                    setTimeout(
                      () =>
                        resolve({
                          title: 'Success',
                          body:
                            'Successfully submitted proposal',
                          config: {
                            showProgressBar: true,
                            closeOnClick: true,
                            timeout: 8000
                          }
                        }),
                      2000
                    )
                    let proposal = {
                      toPublicKey: publicKey,
                      product: recordId,
                      fromPublicKey: this.$store.state.user
                        .publicKey
                    }
                    this.$socket.client.emit(
                      'newProposal',
                      proposal
                    )
                  }
                })
                .catch(error => {
                  if (error === 'requestPassword') {
                    this.$emit('requestPasswordEvent')
                    reject({
                      title: 'Error',
                      body: '',
                      icon: false,
                      config: {
                        timeout: 1
                      }
                    })
                  } else {
                    console.error(error)
                    setTimeout(
                      () =>
                        reject({
                          title: 'Error',
                          body: error,
                          config: {
                            showProgressBar: true,
                            closeOnClick: true,
                            timeout: 8000
                          }
                        }),
                      2000
                    )
                  }
                })
            })
          }
        )
      },
      reportName () {
        this.updateProperty(this.recordId, {
          name: 'name',
          stringValue: this.valueUpdate,
          dataType: payloads.updateProperties.enum.STRING
        })
      },
      reportClassification () {
        this.updateProperty(this.recordId, {
          name: 'classification',
          stringValue: this.valueUpdate,
          dataType: payloads.updateProperties.enum.STRING
        })
      },
      reportOrigin () {
        this.updateProperty(this.recordId, {
          name: 'origin',
          stringValue: this.valueUpdate,
          dataType: payloads.updateProperties.enum.STRING
        })
      },
      reportCultivationProcess () {
        this.updateProperty(this.recordId, {
          name: 'cultivationProcess',
          stringValue: this.valueUpdate,
          dataType: payloads.updateProperties.enum.STRING
        })
      },
      reportSize () {
        this.updateProperty(this.recordId, {
          name: 'size',
          numberValue: parsing.toInt(this.valueUpdate),
          dataType: payloads.updateProperties.enum.NUMBER
        })
      },
      reportWeight () {
        this.updateProperty(this.recordId, {
          name: 'weight',
          numberValue: parsing.toInt(this.valueUpdate),
          dataType: payloads.updateProperties.enum.NUMBER
        })
      },
      reportHarvestDate () {
        this.updateProperty(this.recordId, {
          name: 'harvestDate',
          timestampValue: new Date(this.valueUpdate).getTime() / 1000,
          dataType: payloads.updateProperties.enum.TIMESTAMP
        })
      },
      reportExpirationDate () {
        this.updateProperty(this.recordId, {
          name: 'expirationDate',
          timestampValue: new Date(this.valueUpdate).getTime() / 1000,
          dataType: payloads.updateProperties.enum.TIMESTAMP
        })
      },
      reportPackingDate () {
        this.updateProperty(this.recordId, {
          name: 'packingDate',
          timestampValue: new Date(this.valueUpdate).getTime() / 1000,
          dataType: payloads.updateProperties.enum.TIMESTAMP
        })
      },
      reportShock () {
        this.updateProperty(this.recordId, {
          name: 'shock',
          stringValue: JSON.stringify({
            accel: parsing.toInt(this.acceleration),
            duration: parsing.toInt(this.duration)
          }),
          dataType: payloads.updateProperties.enum.STRING
        })
      },
      reportTilt () {
        this.updateProperty(this.recordId, {
          name: 'tilt',
          stringValue: JSON.stringify({
            x: parsing.toInt(this.tiltX),
            y: parsing.toInt(this.tiltY)
          }),
          dataType: payloads.updateProperties.enum.STRING
        })
      },
      reportLocalization () {
        this.updateProperty(this.recordId, {
          name: 'location',
          locationValue: {
            latitude: parsing.toInt(this.latitude),
            longitude: parsing.toInt(this.longitude)
          },
          dataType: payloads.updateProperties.enum.LOCATION
        })
      },
      reportTemperature () {
        this.updateProperty(this.recordId, {
          name: 'temperature',
          numberValue: parsing.toInt(this.valueUpdate),
          dataType: payloads.updateProperties.enum.NUMBER
        })
      },
      reportHumidity () {
        this.updateProperty(this.recordId, {
          name: 'humidity',
          numberValue: parsing.toInt(this.valueUpdate),
          dataType: payloads.updateProperties.enum.NUMBER
        })
      },
      reportCo2 () {
        this.updateProperty(this.recordId, {
          name: 'co2',
          numberValue: parsing.toInt(this.valueUpdate),
          dataType: payloads.updateProperties.enum.NUMBER
        })
      },
      openDialog (model, key, label) {
        this.dialogProperties = true
        this.key = key
        this.dialogLabel = label
        this.valueUpdate = model
      },
      openTiltDialog (tiltX, tiltY, key1, key2) {
        this.dialogTilt = true
        this.key1 = key1
        this.key2 = key2
        this.tiltX = tiltX
        this.tiltY = tiltY
      },
      openShockDialog (acceleration, duration, key1, key2) {
        this.dialogShock = true
        this.key1 = key1
        this.key2 = key2
        this.acceleration = acceleration
        this.duration = duration
      },
      openLocalizationDialog (latitude, longitude, key1, key2) {
        this.dialogLocalization = true
        this.key1 = key1
        this.key2 = key2
        this.latitude = latitude
        this.longitude = longitude
      },
      openTransferDialog () {
        this.dialogTransfer = true
      },
      roleToEnum (role) {
        //todo for the future
        if ((role = 'owner')) {
          return payloads.createProposal.enum.OWNER
        } else if ((role = 'custodian')) {
          return payloads.createProposal.enum.CUSTODIAN
        } else if ((role = 'reporter')) {
          return payloads.createProposal.enum.REPORTER
        }
      },
      submit () {
        this.submitProposal(this.recordId, this.role, this.publicKey)
        this.dialogTransfer = false
      },
      submitProperty () {
        _.set(this.key, this.valueUpdate)
        if (this.key == 'temperature') {
          this.reportTemperature()
        } else if (this.key == 'humidity') {
          this.reportHumidity()
        } else if (this.key == 'co2') {
          this.reportCo2()
        } else if (this.key == 'name') {
          this.reportName()
        } else if (this.key == 'classification') {
          this.reportClassification()
        } else if (this.key == 'origin') {
          this.reportOrigin()
        } else if (this.key == 'cultivationProcess') {
          this.reportCultivationProcess()
        } else if (this.key == 'size') {
          this.reportSize()
        } else if (this.key == 'weight') {
          this.reportWeight()
        } else if (this.key == 'harvestDate') {
          this.reportHarvestDate()
        } else if (this.key == 'expirationDate') {
          this.reportExpirationDate()
        } else if (this.key == 'packingDate') {
          this.reportPackingDate()
        } else {
          this.finalizeProduct()
        }
        this.key = ''
        this.dialogProperties = false
      },
      submitTilt () {
        _.set(this.tiltX, this.tiltY)
        this.reportTilt()
        this.dialogTilt = false
      },
      submitShock () {
        _.set(this.acceleration, this.duration)
        this.reportShock()
        this.dialogShock = false
      },
      submitLocalization () {
        _.set(this.latitude, this.longitude)
        this.reportLocalization()
        this.dialogLocalization = false
      },
      closeDialogGenerateSubProduct () {
        this.dialogGenerateSubProduct = false
        this.getProduct()
      }
    },
    computed: {
      keyErrors () {
        const errors = []

        if (this.key === 'name') {
          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.maxLength &&
          errors.push(
            'The name should not be more that 50 characters long'
          )
          !this.$v.valueUpdate.minLength &&
          errors.push('The name must be at most 1 characters long')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'
          return errors
        }
        if (this.key === 'classification') {
          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.maxLength &&
          errors.push(
            'The classification should not be more that 50 characters long'
          )
          !this.$v.valueUpdate.minLength &&
          errors.push(
            'The classification must be at most 1 characters long'
          )

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'
          return errors
        }
        if (this.key === 'origin') {
          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.maxLength &&
          errors.push(
            'The origin should not be more that 50 characters long'
          )
          !this.$v.valueUpdate.minLength &&
          errors.push('The origin must be at most 1 characters long')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'
          return errors
        }
        if (this.key === 'cultivationProcess') {
          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.maxLength &&
          errors.push(
            'The Cultivation Process should not be more that 50 characters long'
          )
          !this.$v.valueUpdate.minLength &&
          errors.push(
            'The Cultivation Process must be at most 1 characters long'
          )

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'
          return errors
        }
        if (this.key === 'weight') {
          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.minLength &&
          errors.push('The weight must be at most 1 characters long')
          !this.$v.valueUpdate.maxLength &&
          errors.push(
            'The weight should not be more that 10 characters long'
          )
          !this.$v.valueUpdate.decimal &&
          errors.push('The weight must be a decimal number.')
          !this.$v.valueUpdate.minValue &&
          errors.push('The weight must be greater than zero')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'
          return errors
        }
        if (this.key === 'size') {
          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.minLength &&
          errors.push('The size must be at most 1 characters long')
          !this.$v.valueUpdate.maxLength &&
          errors.push(
            'The size should not be more that 10 characters long'
          )
          !this.$v.valueUpdate.decimal &&
          errors.push('The size must be a decimal number.')
          !this.$v.valueUpdate.minValue &&
          errors.push('The size must be greater than zero')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'
          return errors
        }
        if (this.key === 'harvestDate') {
          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.maxLength &&
          errors.push(
            'The harvest data must be 1 to 11 characters long'
          )

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'
          return errors
        }
        if (this.key === 'expirationDate') {
          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.maxLength &&
          errors.push(
            'The expiration date should not be more that 11 characters long'
          )

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'
          return errors
        }
        if (this.key === 'packingDate') {
          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.maxLength &&
          errors.push(
            'The packingDate should not be more that 11 characters long'
          )

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'
          return errors
        }
        if (this.key === 'temperature') {
          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.minLength &&
          errors.push(
            'The Temperature must be at most 1 characters long'
          )
          !this.$v.valueUpdate.maxLength &&
          errors.push(
            'The Temperature should not be more that 9 characters long'
          )
          !this.$v.valueUpdate.decimal &&
          errors.push('The Temperature must be a decimal number.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }
        if (this.key === 'co2') {
          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.minLength &&
          errors.push('The CO2 must be at most 1 characters long')
          !this.$v.valueUpdate.maxLength &&
          errors.push(
            'The CO2 should not be more that 9 characters long'
          )
          !this.$v.valueUpdate.decimal &&
          errors.push('The CO2 must be a decimal number.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }
        if (this.key === 'humidity') {
          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.minLength &&
          errors.push(
            'The Humidity must be at most 1 characters long'
          )
          !this.$v.valueUpdate.maxLength &&
          errors.push(
            'The Humidity should not be more that 9 characters long'
          )
          !this.$v.valueUpdate.decimal &&
          errors.push('The Humidity must be a decimal number.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }
        if (this.key === 'finalize') {
          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.minLength &&
          errors.push(
            'The Justification must be at most 1 characters long'
          )
          !this.$v.valueUpdate.maxLength &&
          errors.push(
            'The Justification should not be more that 50 characters long'
          )
          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }
      },
      doublePropsErrors () {
        const errors = []
        if (this.key1 === 'tiltX') {
          if (!this.$v.tiltX.$dirty) return errors
          !this.$v.tiltX.minLength &&
          errors.push('The X must be at most 1 characters long')
          !this.$v.tiltX.maxLength &&
          errors.push(
            'The X should not be more that 9 characters long'
          )
          !this.$v.tiltX.decimal &&
          errors.push('The X must be a decimal number.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }

        if (this.key1 === 'acceleration') {
          if (!this.$v.acceleration.$dirty) return errors
          !this.$v.acceleration.minLength &&
          errors.push(
            'The acceleration must be at most 1 characters long'
          )
          !this.$v.acceleration.maxLength &&
          errors.push(
            'The acceleration should not be more that 9 characters long'
          )
          !this.$v.acceleration.decimal &&
          errors.push('The acceleration must be a decimal number.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }

        if (this.key1 === 'latitude') {
          if (!this.$v.latitude.$dirty) return errors
          !this.$v.latitude.minLength &&
          errors.push(
            'The latitude must be at most 1 characters long'
          )
          !this.$v.latitude.maxLength &&
          errors.push(
            'The latitude should not be more that 9 characters long'
          )
          !this.$v.latitude.decimal &&
          errors.push('The latitude must be a decimal number.')
          !this.$v.latitude.between &&
          errors.push('The latitude must be between -90 and 90.')
          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }
      },
      doublePropsErrors2 () {
        const errors = []

        if (this.key2 === 'tiltY') {
          if (!this.$v.tiltY.$dirty) return errors
          !this.$v.tiltY.minLength &&
          errors.push('The Y must be at most 1 characters long')
          !this.$v.tiltY.maxLength &&
          errors.push(
            'The Y should not be more that 9 characters long'
          )
          !this.$v.tiltY.decimal &&
          errors.push('The Y must be a decimal number.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }

        if (this.key2 === 'duration') {
          if (!this.$v.duration.$dirty) return errors
          !this.$v.duration.minLength &&
          errors.push(
            'The duration must be at most 1 characters long'
          )
          !this.$v.duration.maxLength &&
          errors.push(
            'The duration should not be more that 9 characters long'
          )
          !this.$v.duration.decimal &&
          errors.push('The duration must be a decimal number.')
          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'
          return errors
        }

        if (this.key2 === 'longitude') {
          if (!this.$v.longitude.$dirty) return errors
          !this.$v.longitude.minLength &&
          errors.push(
            'The longitude must be at most 1 characters long'
          )
          !this.$v.longitude.maxLength &&
          errors.push(
            'The longitude should not be more that 9 characters long'
          )
          !this.$v.longitude.decimal &&
          errors.push('The longitude must be a decimal number.')
          !this.$v.longitude.between &&
          errors.push('The longitude must be between -180 and 180.')
          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'
          return errors
        }
      },
      rules () {
        switch (this.key) {
          case 'name':
            return {
              minLength: minLength(1),
              maxLength: maxLength(50)
            }
          case 'classification':
            return {
              minLength: minLength(1),
              maxLength: maxLength(50)
            }
          case 'origin':
            return {
              minLength: minLength(1),
              maxLength: maxLength(50)
            }
          case 'cultivationProcess':
            return {
              minLength: minLength(1),
              maxLength: maxLength(50)
            }
          case 'size':
            return {
              minLength: minLength(1),
              maxLength: maxLength(10),
              decimal,
              minValue: minValue(0.1)
            }
          case 'weight':
            return {
              minLength: minLength(1),
              maxLength: maxLength(10),
              decimal,
              minValue: minValue(0.1)
            }
          case 'harvestDate':
            return {
              minLength: minLength(1),
              maxLength: maxLength(11)
            }
          case 'expirationDate':
            return {
              minLength: minLength(1),
              maxLength: maxLength(11)
            }
          case 'packingDate':
            return {
              minLength: minLength(1),
              maxLength: maxLength(11)
            }
          case 'temperature':
            return {
              minLength: minLength(1),
              maxLength: maxLength(9),
              decimal
            }
          case 'co2':
            return {
              minLength: minLength(1),
              maxLength: maxLength(9),
              decimal
            }
          case 'humidity':
            return {
              minLength: minLength(1),
              maxLength: maxLength(9),
              decimal
            }
          case 'finalize':
            return {
              minLength: minLength(1),
              maxLength: maxLength(250)
            }
        }
      }
    },
    beforeMount: function () {
      this.getProduct(), this.getUsers()
    }
  }
</script>

<style scoped></style>
