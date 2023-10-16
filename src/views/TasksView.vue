<template>
  <div class="main">
    <!--Progress-->
    <div class="progress">
      <div class="title">Progress</div>
      <v-progress-linear v-model="progress" height="25">
        <strong>{{ Math.ceil(progress) }}%</strong>
      </v-progress-linear>
    </div>
    <!--Buttons-->

    <div class="buttons">
      <v-btn outlined color="blue" @click="showFilter = !showFilter">{{
        showButtonNaming
      }}</v-btn>
      <v-btn outlined color="blue" @click="addTask()">Add Task</v-btn>
    </div>

    <!--Filter-->
    <div v-if="showFilter">
      <div class="filter">
        <div>
          <label>Title</label>
          <v-text-field v-model="title" label="Title"></v-text-field>
        </div>
        <div>
          <label>Label</label>
          <v-text-field v-model="label" label="Label"></v-text-field>
        </div>
        <div>
          <label>Description</label>
          <v-text-field
            v-model="description"
            label="Description"
          ></v-text-field>
        </div>
        <div>
          <label>From Date</label>
          <Datepicker v-model="fromDate" :format="dateFormat" />
        </div>
        <div>
          <label>To Date</label>
          <Datepicker v-model="toDate" :format="dateFormat" />
        </div>

        <div class="button">
          <v-btn @click="search">Search</v-btn>
        </div>
      </div>
      <div class="sort">
        <label>Sort By</label>
        <div class="sort_fields">
          <v-select
            v-model="sortField"
            label="Sort By Fields"
            :items="sortFields"
            item-title="value"
            item-value="id"
          ></v-select>
          <v-select
            v-model="sortOrder"
            label="Order"
            :items="['Ascending', 'Descending']"
          ></v-select>
        </div>
      </div>
    </div>
    <!--Task List-->
    <div class="tasks">
      <div
        class="task_box"
        @drop="onDrop($event, 'pending')"
        @dragover.prevent
        @dragenter.prevent
      >
        <!--Title-->
        <div class="title">
          {{ `Pending ${pendingArray.length}/${showList.length}` }}
        </div>
        <div id="pending">
          <div
            v-if="pendingArray.length > 0"
            v-for="item in pendingArray"
            :key="item"
            class="task_main"
            draggable="true"
            @dragstart="startDrag($event, item)"
          >
            <div draggable="true" @dragstart="startDrag($event, item)">
              <TaskCard :task="item" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="task_box"
        @drop="onDrop($event, 'processing')"
        @dragover.prevent
        @dragenter.prevent
      >
        <!--Title-->
        <div class="title">
          {{ `Processing ${processingArray.length || 0}/${showList.length}` }}
        </div>
        <div id="processing">
          <div
            v-if="processingArray.length > 0"
            v-for="item in processingArray"
            v-bind:key="item.id"
            class="task_main"
          >
            <div draggable="true" @dragstart="startDrag($event, item)">
              <TaskCard draggable :task="item" />
            </div>
          </div>
        </div>
      </div>

      <div
        class="task_box"
        @drop="onDrop($event, 'done')"
        @dragover.prevent
        @dragenter.prevent
      >
        <!--Title-->
        <div class="title">
          {{ `Done ${doneArray.length || 0}/${showList.length}` }}
        </div>
        <div id="done">
          <div
            v-if="doneArray.length > 0"
            v-for="item in doneArray"
            :key="item"
            class="task_main"
          >
            <div draggable="true" @dragstart="startDrag($event, item)">
              <TaskCard draggable :task="item" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useTodosStore } from '@/stores/tasklist';
// import { VueDraggableNext } from 'vue-draggable-next';
import TaskCard from '../components/TaskCard.vue';
import { setTransitionHooks } from 'vue';

export default {
  components: {
    Datepicker,
    TaskCard,
  },
  data: () => ({
    store: useTodosStore(),
    fromDate: null,
    toDate: null,
    dateFormat: 'yyyy-MM-dd',
    showFilter: false,
    pendingArray: [],
    processingArray: [],
    doneArray: [],
    showList: [],
    sortField: null,
    sortOrder: 'Ascending',
    sortFields: [
      {
        id: 'title',
        value: 'Title',
      },
      {
        id: 'description',
        value: 'Description',
      },
      {
        id: 'attachmentsPreview',
        value: 'No. of Attachments',
      },
      {
        id: 'estimatedTime',
        value: 'Estimated Date',
      },
    ],
  }),
  computed: {
    showButtonNaming() {
      return this.showFilter ? 'Hide Filter' : 'Filter & Search';
    },
    totalList() {
      return this.store.todos;
    },
    progress() {
      return (this.doneArray.length / this.totalList.length) * 100 || 0;
    },
  },
  mounted() {
    this.showList = this.totalList;
    this.mapArray();
  },
  watch: {
    showList() {
      this.mapArray();
    },
    totalList() {
      this.showList = this.totalList;
    },
  },
  methods: {
    mapArray() {
      this.pendingArray = this.showList.filter(
        (item) => item.status == 'pending'
      );
      this.processingArray = this.showList.filter(
        (item) => item.status == 'processing'
      );
      this.doneArray = this.showList.filter((item) => item.status == 'done');
    },

    addTask() {
      this.$router.push('/add');
    },
    async onDrop(event, item) {
      const relatedValue = event.dataTransfer.getData('item');
      const todosStore = useTodosStore();
      await todosStore.updateTodoStatus(relatedValue, item);
      //   if (item == 'pending') {

      //   } else if (item == 'processing') {
      //   } else {
      //   }
    },
    startDrag(event, item) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('item', item.id);
    },
    search() {
      this.showList = this.totalList;
      if (this.title) {
        this.showList = this.showList.filter((item) =>
          this.title != '' ? item.title == this.title : ''
        );
      }
      if (this.description) {
        this.showList = this.showList.filter((item) =>
          this.description != '' ? item.description == this.description : null
        );
      }
      if (this.label) {
        this.showList = this.showList.filter((item) =>
          this.label != ''
            ? item.labels.some((value) => value == this.label)
            : null
        );
      }
      if (this.fromDate) {
        this.showList = this.showList.filter((item) =>
          this.fromDate != '' ? item.estimatedTime >= this.fromDate : null
        );
      }
      if (this.toDate) {
        this.showList = this.showList.filter((item) =>
          this.toDate != '' ? item.estimatedTime <= this.toDate : null
        );
      }
      if (this.sortField) {
        const tempArray = this.showList.sort((a, b) =>
          this.sortOrder == 'Ascending'
            ? this.sortField == 'attachmentsPreview'
              ? a[this.sortField].length - b[this.sortField].length
              : a[this.sortField] - b[this.sortField] ||
                a[this.sortField].localeCompare(b[this.sortField])
            : this.sortField == 'attachmentsPreview'
            ? b[this.sortField].length - a[this.sortField].length
            : b[this.sortField] - a[this.sortField] ||
              b[this.sortField].localeCompare(a[this.sortField])
        );
        this.showList = [];
        tempArray.forEach((item) => this.showList.push(item));
      }
    },
  },
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  justify-self: center;
}

.progress {
  border: 1px gray solid;
  padding: 10px;
  box-shadow: seashell;
}

.title {
  font-weight: bold;
  font-size: 24px;
  text-align: center;
}

.filter {
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-auto-columns: 50px;
  grid-auto-rows: 80px;
  grid-gap: 20px;
}

.buttons {
  display: flex;
  justify-content: end;
  padding: 10px;
  grid-gap: 5px;
}

.button {
  display: flex;
  justify-content: center;
  justify-items: center;
}

.tasks {
  display: flex;
  flex-direction: row;

  grid-gap: 10px;
}
.task_box {
  width: 100%;

  box-shadow: 100;
  padding: 10px;
}

.task_main {
  margin-bottom: 12px;
}

.sort_fields {
  display: flex;
  flex-direction: row;
  grid-gap: 20px;
}
</style>
