import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("userData", () => {
  const userId = ref("");

  const nickname = computed(() => userId.value);

  const setUserId = (id) => {
    userId.value = id;
  };

  const roomName = ref("");

  const lobbyId = computed(() => roomName.value);

  const setLobbyId = (lobbyId) => {
    roomName.value = lobbyId;
  };

  const socket = ref(null);

  const setSocket = (client) => (socket.value = client);

  return {
    setUserId,
    setSocket,
    setLobbyId,
    socket,
    nickname,
    lobbyId,
  };
});
