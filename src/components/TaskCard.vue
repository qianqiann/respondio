<template>
  <div class="main">
    <!--Details-->

    <div style="background-color: pink" class="main_title">
      <div>
        {{ task.title }}
      </div>
      <div class="icon_main" @click="editTask()">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="none" stroke-width="1.5"
          viewBox="0 0 24 24" color="#000000">
          <path stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
            d="M13.879 7.697 16 9.817a1 1 0 0 1 0 1.415L8.363 18.87a1.001 1.001 0 0 1-.326.218L5.54 20.114c-1.233.508-2.466-.725-1.958-1.958L4.61 15.66a.999.999 0 0 1 .218-.327l7.636-7.636a1 1 0 0 1 1.415 0ZM13.879 3.454 16 5.575m4.243 4.243L18.12 7.697m-2.12-2.122 1.413-1.414a1 1 0 0 1 1.414 0l.708.707a1 1 0 0 1 0 1.414L18.12 7.697m-2.12-2.122 2.12 2.122">
          </path>
        </svg>
      </div>
    </div>
    <div class="task_data">
      <span class="title">Labels:</span>
      <div class="value chip_group">
        <v-chip-group>
          <v-chip v-for="(item) in task.labels" v-bind:key="item">
            <div>
              {{ item }}
            </div>
          </v-chip>
        </v-chip-group>
        <div v-if="task.labels.length < 1">N/A</div>
      </div>
      <span class="title">Description:</span>
      <div class="description value">
        {{ task.description }}
      </div>
      <span class="title">Estimated Date:</span>
      <div class="value">
        {{ formatDate(task.estimatedTime) }}
      </div>
      <span class="title">Attachments:</span>
      <div class="value">
        {{ task.attachmentsPreview.length }}
      </div>

      <v-dialog width="500">
        <template v-slot:activator="{ props }">
          <div class="button_main">
            <v-btn v-bind="props" color="blue" text="View Attachments"> </v-btn>
          </div>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card>
            <v-carousel>
              <v-carousel-item v-for="item in task.attachmentsPreview" :src="item.previewUrl" cover
                v-bind:key="item"></v-carousel-item>
            </v-carousel>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text="Close" @click="isActive.value = false"></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: { type: Array, default: [] },
    colorLabel: ['#DBDCE3', '#EFE6F5', '#F5E8E6', '#F3F5E6'],
  },
  data: () => ({
    isActive: false,
  }),
  watch: {},
  methods: {
    formatDate(date) {
      if (!date) return;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
    onDragStart(event, item) { },
    handleDrop(event, item) {
      event.preventDefault();
      let currentWindow = document.body.clientWidth;
      let oneDiv = currentWindow / 3;

      let moveTarget = null;
      if (event.screenX < oneDiv) {
        moveTarget = 'pending';
      } else if (event.screenX < 400) {
        moveTarget = 'processing';
      } else {
        moveTarget = 'done';
      }
    },

    editTask() {
      this.$router.push(`/edit/${this.task.id}`);
    },
  },
};
</script>
<style scoped>
.main {
  padding: 10px;
  width: 100%;
  border: black 1px solid;
}

.task_main {
  padding: 10px;
}

.description {
  max-height: 50px;
  overflow: hidden;
}

.main_title {
  padding: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.value {
  display: flex;
  flex-direction: row;
}

.title {
  font-weight: bold;
}

.icon {
  width: 12px;
  color: black;
}

.icon_main {
  display: flex;
  justify-items: center;
}

.task_data {
  padding: 5px;
}

.button_main {
  padding: 5px;
}

.v-chip-group.v-theme--light {
  max-height: 50px;
  overflow: scroll;
}

.chip_group {
  height: 50px;
}
</style>
