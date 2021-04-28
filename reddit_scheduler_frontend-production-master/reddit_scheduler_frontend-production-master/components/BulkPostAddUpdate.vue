<template>
  <v-dialog 
    v-model="diaglogDisplay" 
    @click:outside="closeDialog"
  >
     <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      bottom
      right
      light
    >
      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          light
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-card style="overflow-y: visible">
      
      <v-card-title dense class="headline grey lighten-2" primary-title>
        {{ cardTitle }}
      </v-card-title>
      <v-card-text class="mt-4">
      <v-alert
        dense
        text
        :type="snackbarCounter != snackbarCount ? 'warning' : 'success'"
        :value="alert"
      >
        <strong>{{snackbarCounter}} / {{snackbarCount}}</strong> Schedule Posts Saved!
      </v-alert>
      
        <v-row>
            <v-col cols="6">
              <v-file-input
                ref="fileupload"
                color="light-purple accent-4"
                @change="selectFile"
                placeholder="Select the CSV File"
                :show-size="1000"
                accept=".csv"
                class="shrink"
                outlined
              >
                <template v-slot:selection="{ index, text }">
                  <v-chip
                    v-if="index < 2"
                    color="light-purple accent-4"
                    dark
                    label
                    small
                  >
                    {{ text }}
                  </v-chip>
                  <span
                    v-else-if="index === 2"
                    class="overline grey--text text--darken-3 mx-2"
                  >
                    +{{ files.length - 2 }} File(s)
                  </span>
                </template>
              </v-file-input>
            </v-col>
            <v-col cols="3">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateMomentText"
                    label="Schedule Post Schedule"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  :min="new Date().toISOString().substr(0, 10)"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="delay timer in minutes"
                type="number"
                min="0"
                v-model="selectedDelayItem"
              ></v-text-field>
            </v-col>
          </v-row>
        <v-spacer></v-spacer>
        <p align="center"><strong>IMPORT DATA PREVIEW</strong></p>
        <v-data-table 
          :headers="parsedHeaders" 
          :items="parsedData" disable-sort
          :class= "rowColor" 
          >
          <template v-slot:[`item.PostSchedule`]="{ item, index }">
             <transition name="slide-fade" mode="out-in">
              <span :key="item.PostSchedule">
                 {{$moment(item.PostSchedule).format("MMMM DD, YYYY")}}
              </span>
            </transition>
              <transition name="slide-fade" mode="out-in">
              <span :key="item.PostSchedule">
                 {{$moment(item.PostSchedule).format("hh:mm A")}}
              </span>
            </transition>
          </template>
          <template v-slot:[`item.PostasUsername`]="{ item }">
              <v-select
                :items="accounts"
                item-text="username"
                item-value="_id"
                v-model="account"
                label="Account"
                @change="updateRecordAccountId(item)"
                v-if="item.Account_ID == null"
                return-object
              ></v-select>
              <span
                v-if="item.Account_ID != null"
              >
                {{item.PostasUsername}}
              </span>
          </template>
          <template v-slot:top>
            <v-dialog v-model="dialog" max-width="800">
              <v-card>
                <v-card-title>
                  <span class="headline">Edit Item</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem['Post Title']"
                          label="Post Title"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem['Label']"
                          label="Label"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem['Link']"
                          label="Link"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem['Subreddit']"
                          label="Text"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-select
                          :items="accounts"
                          item-text="username"
                          item-value="_id"
                          v-model="editedItem.Account_ID"
                          label="Account"
                          return-object
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeEdit">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Update </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="closeDialog"> Close </v-btn>
        <v-btn color="grey" text @click="saveData" :disabled="saveDisabled"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import Validators from "@/mixins/Validators";

export default {
  props: ["display","postGenerateFeather","accounts", "close","counterPost"],
  mixins: [Validators],

  created() {},

  computed: {
    cardTitle() {
      return "Bulk Upload";
    },
    diaglogDisplay: {
      get(){
        return this.display
      },
      set(newName){
        return newName
      } 
    }
  },

  data() {
    return {
      date: this.$moment(new Date()).format("YYYY-MM-DD"),
      dateMomentText: this.$moment(new Date()).format("MMMM DD, YYYY"),
      menu: false,
      delayItems:[10,15,20,25,30,35,40],
      selectedDelayItem: 1,
      saveDisabled: false,
      alert: false,
      timeout: -1,
      snackbar: false,
      snackbarCount: 0,
      snackbarCounter: 0,
      account: "",
      file: false,
      dialog: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      parsedData: [],
      parsedHeaders: [
        { text: "Post Title", value: "Post Title", align:"left" },
        { text: "Label", value: "Label" },
        { text: "Link", value: "Link" },
        { text: "Subreddit", value: "Subreddit" },
        { text: "Account", value: "PostasUsername" },
        { text: "Post Schedule", value: "PostSchedule" },
        { text: "Action ", value: "actions", align: "center" },
      ],
    };
  },
  watch:{
    snackbarCounter(){

        let _self = this;

        if( this.snackbarCounter > 1){
          this.alert = true;
        }

        if(this.snackbarCounter == this.snackbarCount){
          setTimeout(()=>{
            _self.close();
          },2000)
        }

    },
    date(newDate){
      this.dateMomentText = this.$moment(newDate).format("MMMM DD, YYYY");
      this.updateRecordSchedule();
    },
    selectedDelayItem(newMinutes){
      this.updateRecordSchedule();
    }
  },
  methods: {
    async updateRecordSchedule(){
      
      let currentMinutes = parseInt(this.selectedDelayItem);
      
      this.parsedData.forEach( async (data) => {
        data["PostSchedule"] = `${ this.$moment(this.date + " " + this.$moment().format("hh:mm A")).add(parseInt(currentMinutes), 'minutes').format("MMMM DD, YYYY hh:mm A") }`
        data["PostScheduleRaw"] = this.$moment(this.date + " " + this.$moment().format("hh:mm A")).add(parseInt(currentMinutes), 'minutes')
        currentMinutes = currentMinutes + parseInt(this.selectedDelayItem);

      })
    },
    async selectFile(file) {
      
      let _self = this

      this.$papa.parse(file, {
        delimiter: ",",
        dynamicTyping: true,
        header: true,
        encoding: "ISO-8859-1",
        skipEmptyLines: true,
        complete: (results) => {

          let counter = 0;

          results.data.forEach(csvRecord=> {

            const foundAccount = this.accounts.filter((el) => {
              if(el.username == csvRecord["Post as Username"]){ 
                return el;
              }
            });
            
            if(foundAccount.length > 0){
              csvRecord["Account_ID"] = foundAccount[0]["_id"]
            }else{
              csvRecord["Account_ID"] = null
            }

            csvRecord["PostasUsername"] = csvRecord["Post as Username"]
            csvRecord["record_id"] = counter + 1;
            csvRecord["row_color"] = "style-1";

            counter++;

          });

          this.parsedData = results.data;
          this.updateRecordSchedule()
          
          setInterval(() => {
            console.log("HAHAHAHAHA");
          }, 1000);

        },
      });
    },
    editItem(item) {
      this.editedIndex = this.parsedData.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    save () {
        if (this.editedIndex > -1) {
            let updateObject = {
                "Account_ID":  this.editedItem.Account_ID._id,
                "Post as Username":  this.editedItem.Account_ID.username,
                "PostasUsername":  this.editedItem.Account_ID.username
            }
            Object.assign(this.parsedData[this.editedIndex], updateObject)
        } else {
            this.parsedData.push(this.editedItem)
        }
        this.closeEdit();
    },
    closeEdit (){
      this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
    },
    closeDialog(){
      this.parsedData = [];
      this.alert = false;
      this.saveDisabled = false;
      this.diaglogDisplay = false;
      this.close();
    },
    updateRecordAccountId(item){
      
      let _self = this

     this.parsedData.forEach( csvRecord => {

          if(csvRecord["record_id"] == item["record_id"]){

            csvRecord["Account_ID"] = _self.account._id
            csvRecord["Post as Username"] = _self.account.username
            csvRecord["PostasUsername"] = _self.account.username

            return csvRecord;

          }
      })

      _self.account = "";

    },
    async saveData() {

        
        this.snackbarCount = this.parsedData.length;
        this.saveDisabled = true;
        
        this.parsedData.forEach( async (post) => {

          let checker = ( post["PostScheduleRaw"].minute() === (this.$moment().minute()) );

          let newObject = {
            title: post["Post Title"],
            imageUrl: post["Link"],
            subreddit: post["Subreddit"],
            submissionName: post["Account"], // 
            account: post["Account_ID"], // insert ID : logic for looking 
            label: post["Label"],
            postAt: post["PostScheduleRaw"].toISOString(),
            timeShiftPeriod: this.selectedDelayItem,
            timeSetting: checker ? "now" : "at",
            error: '',
          }
          
          if(await this.postGenerateFeather(newObject)){
            this.snackbarCounter++;
          }
          
        })
        
    },
    rowColor(){
      return ".style-1";
    },
  },
};
</script>

<style scoped>
  .slide-fade-enter-active {
    transition: all .2s ease;
  }
  .slide-fade-leave-active {
    transition: all .2s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for <2.1.8 */ {
    transform: translateX(0px);
    opacity: .5;
  }
  .style-1 {
  background-color: rgb(215,215,44) !important
}
.style-2 {
  background-color: rgb(67, 114, 110)
}
</style>