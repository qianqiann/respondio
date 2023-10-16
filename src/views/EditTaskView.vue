<template>
  <SuccessDialog :successAlert="successAlert" successMessage="Updated succesfully" />
  <TaskDetail :task="relatedTask" @edit="editTask" />
</template>

<script>
import TaskDetail from '../components/TaskDetail.vue';
import SuccessDialog from '../components/SuccessDialog.vue';
import { useTodosStore } from '@/stores/tasklist';
export default {
  data: () => ({
    successAlert: false,
  }),
  components: { TaskDetail, SuccessDialog },
  computed: {
    taskId() {
      return this.$route.params.id;
    },
    relatedTask() {
      const todosStore = useTodosStore();
      return todosStore.todos &&
        todosStore.todos &&
        this.taskId &&
        todosStore.todos.filter((item) => item.id == this.taskId)
        ? todosStore.todos.find((item) => item.id == this.taskId)
        : null
    },
  },
  methods: {
    async editTask(request) {
      const todosStore = useTodosStore();
      const sizeArray =
        todosStore.todos && todosStore.todos.length
          ? todosStore.todos.length
          : 0;
      if (
        sizeArray > 0 &&
        todosStore.todos.filter((item) => item.id == request.id).length > 0
      ) {
        await todosStore.updateTodo(request);
        this.successAlert = true;
      }
    },
  },
};
</script>
<style></style>
