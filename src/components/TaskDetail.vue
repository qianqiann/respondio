<template>
  <div class="main">
    <div class="title">{{ !task ? 'Add Task' : 'Update Task' }}</div>
    <v-form ref="form" @submit.prevent>
      <label>Title</label>
      <v-text-field v-model="title" required :rules="titleRule" label="Title"></v-text-field>

      <label>Description</label>
      <v-textarea v-model="description" label="Description"></v-textarea>

      <div>
        <label>Estimated Time</label>
        <Datepicker :clearable="false" class="datepick" v-model="estimatedTime" required :format="dateFormat" />
      </div>
      <label>Status</label>
      <v-select v-model="status" :items="statusList" item-title="name" item-value="id" label="Select"
        :rules="statusRule"></v-select>

      <label>Attachments</label>
      <v-file-input @change="handleFileUpload" accept="image/*" multiple v-model="attachments" :rules="attachmentsRule"
        label="File input"></v-file-input>

      <div class="images">
        <div v-for="(i, index) in showAttachments" v-bind:key="i">
          <div class="image">
            <v-img :width="300" :height="300" cover :src="i.previewUrl"></v-img>
            <v-btn class="remove_button" @click="remove(index)">Remove</v-btn>
          </div>
        </div>
      </div>

      <div>
        <label>Labels</label>
        <span class="tooltip">Click on Chip to Remove</span>
        <div class="chip_main">
          <v-chip-group>
            <v-chip v-for="(item) in labels" v-bind:key="item">
              <div @click="removeChip(item)">
                {{ item }}
              </div>
            </v-chip>
          </v-chip-group>
        </div>
        <div class="label_main">
          <v-text-field v-model="useLabel" label="Add Label"></v-text-field>
          <div class="add_button">
            <v-btn @click="addLabel"> Add </v-btn>
          </div>
        </div>
      </div>

      <div class="field_buttons">
        <div>
          <v-btn class="me-4" type="submit" @click="submit">{{ task ? 'Update Task' : 'Add New Task' }}
          </v-btn>

          <v-btn @click="handleReset"> Clear </v-btn>
        </div>
        <div class="back_button">
          <v-btn @click="backPage"> Back </v-btn>
        </div>
      </div>
    </v-form>
  </div>
</template>
<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
export default {
  components: { Datepicker },
  props: {
    task: { type: Object, required: false },
  },
  data: () => ({
    id: null,
    successAlert: false,
    title: '',
    description: '',
    estimatedTime: new Date(),
    showAttachments: [],
    status: '',
    dateFormat: 'yyyy-MM-dd',
    attachments: [],
    labels: [],
    attachmentsRule: [
      (value) => {
        if (value && value.length > 0) return true;

        return 'At least one attachment is required.';
      },
    ],
    statusList: [
      { id: 'pending', name: 'To Do' },
      { id: 'processing', name: 'Processing' },
      { id: 'done', name: 'Done' },
    ],
    statusRule: [
      (value) => {
        if (value) return true;

        return 'Status is required.';
      },
    ],
    titleRule: [
      (value) => {
        if (value) return true;

        return 'Title is required.';
      },
    ],
  }),
  mounted() {
    if (this.task) {
      this.assignData();
    }
  },
  watch: {
    task() {
      this.assignData();
    },
  },
  methods: {
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const request = {
          title: this.title,
          description: this.description,
          estimatedTime: this.estimatedTime,
          status: this.status,
          attachments: this.attachments,
          labels: this.labels,
          attachmentsPreview: this.showAttachments,
          comment: this.comment,
        };
        if (this.task) {
          request.id = this.task.id;
          this.$emit('edit', request);
        } else {
          this.$emit('add', request);
        }
      }
    },
    handleReset() {
      this.title = '';
      this.description = '';
      this.estimatedTime = new Date();
      this.status = null;
      this.attachments = [];
      this.attachmentsPreview = [];
      this.comment = null;
      this.labels = [];
    },
    remove(i) {
      this.attachments.splice(i, 1);
      this.showAttachments.splice(i, 1);
    },
    handleFileUpload(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.showAttachments.push({
            ...this.attachments[i],
            previewUrl: e.target.result,
          });
        };
        reader.readAsDataURL(files[i]);
      }
    },
    backPage() {
      this.$router.push('/tasks');
    },
    assignData() {
      this.title = this.task.title;
      this.description = this.task.description;
      this.estimatedTime = this.task.estimatedTime;
      this.status = this.task.status;
      this.labels = this.task.labels;
      this.attachments = this.task.attachments;
      this.showAttachments = this.task.attachmentsPreview;
    },
    addLabel() {
      if (
        this.useLabel.trim().length > 0 &&
        this.labels.filter((item) => item == this.useLabel).length < 1
      ) {
        this.labels.push(this.useLabel);
      }
      this.useLabel = '';
    },
    removeChip(item) {
      this.labels = this.labels.filter((value) => value != item);
    },
  },
};
</script>
<style scoped>
.main {
  padding: 10px;
}

label {
  font-size: 16px;
  font-weight: bold;
}

.title {
  font-weight: bold;
  font-size: 24px;
}

.datepick {
  height: 50px;
}

.images {
  padding-bottom: 10px;
  display: grid;
  grid-template-columns: repeat(1, auto);
  justify-items: center;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, auto);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, auto);
  }
}

.remove_button {
  margin: 10px;
}

.image {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.field_buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.back_button {
  justify-self: end;
  justify-items: end;
}

.chip_main {
  background-color: light-gray;
  border-bottom: 1px solid gray;
  padding: 10px;
  margin-bottom: 10px;
}

.label_main {
  display: flex;
  flex-direction: row;
  justify-content: center;
  justify-items: center;
  grid-gap: 10px;
}

.chip_component {
  display: flex;
  flex-direction: row;
}

.tooltip {
  margin-left: 10px;
  font-size: 10px;
}
</style>
