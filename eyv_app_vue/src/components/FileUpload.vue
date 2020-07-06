<template>

    <div class="file">


        <v-file-input :rules="rules"
                      accept="image/png, image/jpeg, image/bmp"
                      label="Picture"
                      placeholder="Pick picture for your record"
                      prepend-icon="mdi-camera"
                      show-size
                      v-model="file"
        />
        <v-btn @click="onSubmit">Submit</v-btn>


    </div>
</template>

<script>
  export default {
    name: 'FileUpload',
    data () {
      return {
        rules: [
          value => !value || value.size < 2000000 || 'Picture size should be less than 2 MB!',
        ],
        file: '',
      }
    },

    methods: {

      onSubmit () {
        const formData = new FormData()
        formData.append('file', this.file)
        console.log(formData)
        axios.post('upload/xxx5', formData).catch(err => {
          console.log(err)
          this.message = err.response.data.error
        })
      }
    },
  }
</script>