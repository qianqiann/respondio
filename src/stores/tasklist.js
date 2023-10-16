import { defineStore } from 'pinia';

// Define the store
export const useTodosStore = defineStore('todoStore', {
  // State
  state: () => ({
    todos: [],
  }),

  // Mutations
  mutations: {},

  // Actions
  actions: {
    async addNewTodo(todo) {
      this.todos.push(todo);
    },
    async updateTodo(todo) {
      const index = this.todos.findIndex((item) => item.id == todo.id);
      this.todos[index] = todo;
    },
    async updateTodoStatus(id, newStatus) {
      this.todos = this.todos.map(function (item) {
        return {
          ...item,
          status: item.id == id ? newStatus : item.status,
        };
      });
    },
  },
});
