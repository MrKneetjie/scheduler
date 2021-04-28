<template>
  <v-dialog
    v-model="display"
    width="500"
    height="1000"
    @click:outside="close"
  >
    <v-card style="overflow-y: visible;">
      <v-card-title
        dense
        class="headline grey lighten-2"
        primary-title
      >
        {{ cardTitle }}
      </v-card-title>
      <v-form 
        v-model="formValid"
        @submit.prevent="save"
        ref="form"
        lazy-validation
      >
        <v-card-text>
          <v-overlay
            absolute
            :value="saving"
            opacity="1"
          >
            <v-progress-circular
              indeterminate
              color="primary"
              class="text-center"
              size="64"
            ></v-progress-circular>
          </v-overlay>
          <v-text-field
            v-model="post.label"
            label="Timestamp"
            :rules="notEmptyRule"
          ></v-text-field>
          <v-select
            :items="accounts"
            item-text="username"
            item-value="_id"
            v-model="post.account"
            label="Account"
            :rules="notEmptyRule"
          ></v-select>
          <textarea-emoji-picker v-model="post.title"  :rules="notEmptyRule"/>
          <v-row>
            <v-col cols="8">
              <v-file-input
                label="Select Image"
                @change="imgSelect"
                :key="post.__id"
              ></v-file-input>
            </v-col>
            <v-col cols="4">
              <v-img :src="post.imageUrl" height="100" contain />
            </v-col>
          </v-row>
          <v-text-field
            v-model="post.subreddit"
            label="Subreddit"
            :rules="notEmptyRule"
          ></v-text-field>
          <v-select
            label="Post Time"
            v-model="post.timeSetting"
            :items="timeSelectOptions"
          ></v-select>
          <v-row v-if="showTimeShiftUnits">
            <v-col>
              <v-select
                label="Units"
                v-model="post.timeShiftUnits"
                :items="timeShiftUnitsOptions"
                value="minutes"
                @change="timeShiftUnitsChanged"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                label="Period"
                :items="timeShiftSelectOptions"
                v-model="post.timeShiftPeriod"
              >
              </v-select>
            </v-col>
          </v-row>
          <v-datetime-picker 
            v-if="showTimePicker"
            label="Post At" 
            v-model="pickerDateTime"
            @input="dateTimeChanged"> 
          </v-datetime-picker>
          <v-checkbox
            v-model="editNextCheckbox"
            label="Submit another post after"
            key="1"
            hide-details
          ></v-checkbox>
        </v-card-text>
       
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            text
            @click="close"
          >
            Close
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            text
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog> 
</template>

<script>
//import { moment } from '@nuxtjs/moment';
import Validators from '@/mixins/Validators';
import TextareaEmojiPicker from './TextareaEmojiPicker'

export default {
  name: 'post-add-update-dialog',
  components:{TextareaEmojiPicker},
  props: ['display', 'post', 'editNext', 'accounts', 'addUpdate', 'close'],
  mixins: [ Validators ],

  created(){
    this.editNextCheckbox = this.editNext;
    console.log(this.editNextCheckbox);
  },

  computed: {

    cardTitle(){
      if(this.editNext)
        return 'Next Post';
      return 'Post'
    },

    defaultTimeShiftPeriod(){
      const timeShiftUnits = this.post.timeShiftUnits;
      if(timeShiftUnits === 'minutes')
        return 15;
      return 1;
    },
    
    accSelectItems(){
      return this.accounts.map(account => ({text: account.username, value: account._id}));
    },

    showTimePicker(){
      return this.post.timeSetting === 'at';
    },

    showTimeShiftUnits(){
      return this.post.timeSetting === 'after';
    },

    timeShiftLabel(){
      const unitName = this.post.timeShiftUnits;
      return unitName.charAt(0).toUpperCase() + unitName.slice(1);
    },

    timeShiftSelectOptions(){
      let steps = 0, stepSize = 0;
      const shiftUnits = this.post.timeShiftUnits;
      if(shiftUnits === 'minutes'){
        stepSize = 15;
        steps = 30;
      }
      else {
        stepSize = 1;
        steps = 30;
      }
      const result = [];
      for(let i = 1; i <= steps; i++)
        result.push({ text: (i * stepSize).toString(), value: (i * stepSize) })
      return result; 
    },
  },

  data(){
    return {
      text: '',
      isNext: false,

      saving: false,

      editNextCheckbox: false,

      pickerDateTime: new Date(this.post.postAt),
      
      accSelected: this.accounts[0] ? this.accounts[0]._id : '',

      timeSelectOptions: [
        { text: 'Now', value: 'now' },
        { text: 'After', value: 'after' },
        { text: 'At', value: 'at' }
      ],

      timeShiftUnitsOptions: [
        { text: 'Minutes', value: 'minutes' },
        { text: 'Hours', value: 'hours' },
        { text: 'Days', value: 'days' }
      ],

      timeSetting: 'now',

      formValid: true,

      notEmptyRule: [ this.notEmpty ],

    }
  },

  methods: {
    imgSelect(file){
       if(file){
        const reader = new FileReader();
        reader.onload = e => {
          this.post.img = e.target.result;
          this.post.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
     }
    },
    
    dateTimeChanged(dateTime){
      if(dateTime)
        this.post.postAt = dateTime.toISOString();
    },

    save(){
      if(!this.$refs.form.validate())
        return;
      this.postTimeUpdate();
      if(this.editNextCheckbox){
        this.saving = true;
      }
        this.isNext = true;
      this.addUpdate(this.post, this.editNextCheckbox)
        .then(() => {
          this.saving = false;
          this.editNextCheckbox = this.editNext;
        });
    },

    timeShiftUnitsChanged(timeShiftUnits){
      //this.post.timeShiftUnits = timeShiftUnits;
      this.post.timeShiftPeriod = this.defaultTimeShiftPeriod;
    },

    postTimeUpdate(){
      if(this.post.timeSetting === 'after')
        this.post.postAt = this.$moment().add(this.post.timeShiftPeriod, this.post.timeShiftUnits).toISOString();
      if(this.post.timeSetting === 'now')
        this.post.postAt = new Date().toISOString();
    }
  }

}
</script>

<style scoped>


</style>
