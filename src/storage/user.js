import { defineStore } from "pinia";

const API_BASE_URL = "http://localhost:3000";

export const useUserStore = defineStore({
  id: "userData",
  state: () => ({
    nickname: "",
    lobbyId: "",
  }),
  actions: {
    async getLobbyName(nickname, lobbyId) {
      const body = JSON.stringify({
        userId: nickname,
        lobbyId: lobbyId ?? "",
      });
      let alertMessage = "";
      try {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        });
        const jsonParsed = await response.json();
        if (response.status >= 400) {
          alertMessage = jsonParsed.error;
          throw new Error();
        }
        this.nickname = nickname;
        this.lobbyId = jsonParsed.data.lobbyId;
      } catch (error) {
        alert(alertMessage);
      }
    },
  },
});
