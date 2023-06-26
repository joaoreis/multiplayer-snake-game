import { defineStore } from "pinia";
import { ref } from "vue";

const API_BASE_URL = "http://localhost:3000";

export const useUserStore = defineStore("userData", () => {
  const roomName = ref("");
  const lobbyId = () => roomName.value;
  const userId = ref("");
  const nickname = () => userId.value;

  const getLobbyName = async (nickname, room) => {
    const body = JSON.stringify({
      userId: nickname,
      lobbyId: room ?? "",
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
      userId.value = nickname;
      roomName.value = jsonParsed.data.lobbyId;
    } catch (error) {
      console.log(error);
      throw new Error(alertMessage);
    }
    console.log(lobbyId);
  };

  return {
    lobbyId,
    getLobbyName,
    nickname,
  };
});
