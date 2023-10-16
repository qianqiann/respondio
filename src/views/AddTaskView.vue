<script>
import TaskDetail from '../components/TaskDetail.vue';
import SuccessDialog from '../components/SuccessDialog.vue';
import { useTodosStore } from '@/stores/tasklist';
export default {
  data: () => ({
    successAlert: false,
  }),
  components: { TaskDetail, SuccessDialog },
  methods: {
    async addTask(request) {
      const todosStore = useTodosStore();
      const sizeArray =
        todosStore.todos && todosStore.todos.length
          ? todosStore.todos.length
          : 0;
      request.id = `TEST${sizeArray + 1}`;
      await todosStore.addNewTodo(request);
      this.successAlert = true;
    },
  },
};
</script>

<template>
  <SuccessDialog
    :successAlert="successAlert"
    successMessage="Added succesfully"
  />
  <TaskDetail @add="addTask" />
</template>
