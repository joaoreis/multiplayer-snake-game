import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("userData", () => {
  const userId = ref("");

  const nickname = computed(() => userId.value);

  const socket = ref(null);

  const setUserId = (id) => {
    userId.value = id;
  };

  const setSocket = (client) => (socket.value = client);

  return {
    setUserId,
    setSocket,
    socket,
    nickname,
  };
});
