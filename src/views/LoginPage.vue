<template>
  <section class="login canvas">
    <div class="login__header">
      <h1 class="login__title">Snake Game</h1>
    </div>

    <div class="login__card">
      <form class="login__form">
        <div class="login__form-group">
          <label for="nick">Digite seu Nick</label>
          <input
            :class="{ 'login__form-group__input--wrong': userWrong }"
            type="text"
            name="nick"
            v-model="userId"
            required
          />
          <p v-if="userWrong" class="login__form-group__error-description">
            Nickname inválido.
          </p>
        </div>
        <div class="login__form-group">
          <label for="roomName">Digite o nome da Sala</label>
          <input
            :class="{ 'login__form-group__input--wrong': lobbyWrong }"
            type="text"
            name="roomName"
            v-model="roomName"
          />
          <p v-if="lobbyWrong" class="login__form-group__error-description">
            Nome da sala inválido.
          </p>
        </div>
        <div class="login__button-group">
          <input type="button" :value="roomText" @click="criarSala()" />
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/storage/user";
import { computed, reactive } from "vue";
import router from "@/router";

const state = reactive({
  socket: null,
});

const userWrong = ref(false);
const lobbyWrong = ref(false);

const { nickname, setUserId, setSocket, setLobbyId } = useUserStore();

const userId = ref(nickname ?? "");
const roomName = ref("");

const roomText = computed(() => {
  return roomName.value ? "Entrar na Sala" : "Criar Sala";
});

const criarSala = async () => {
  if (roomName.value) {
    state.socket.emit("joinLobby", {
      lobbyId: roomName.value,
      userId: userId.value,
    });
  } else {
    state.socket.emit("newLobby", {
      userId: userId.value,
    });
  }

  setUserId(userId.value);
  setSocket(state.socket);
};

// Production
// eslint-disable-next-line no-undef
state.socket = io("http://localhost:5000");

// Local development
// eslint-disable-next-line no-undef
// state.socket = io("http://localhost:8080/");

state.socket.on("joinedLobby", function ({ lobbyId }) {
  setLobbyId(lobbyId);
  router.push({ name: "game" });
});
// state.socket = io("https://fangandfriends-backend-pr-7.onrender.com/");

state.socket.on("invalidLobbyId", () => (lobbyWrong.value = true));

state.socket.on("invalidUser", () => (userWrong.value = true));

state.socket.on("gameAlreadyStarted", () => {
  lobbyWrong.value = true;
});

state.socket.on("tooManyPlayers", () => {
  lobbyWrong.value = true;
});
</script>

<style lang="scss" scoped>
.container {
  padding: 4% 8%;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #414160;
}

.login {
  font-family: "Courier New", Courier, monospace;
  border: 2px solid #9898bb;
  font-size: 24px;
  background-color: #1a1a3886;
  border-radius: 10px;
  overflow: hidden;
  width: 600px;
  height: 600px;
  &__header {
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    color: rgba(255, 255, 255, 0.801);
    border-bottom: 2px solid #9898bb;
  }
  &__card {
    border: solid 2px rgba(26, 26, 56, 0.5254901961);
    padding: 8% 8%;
    border-radius: 5px;
    height: 100%;
    background-color: #101022;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__form {
    &-group {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 1rem;
      color: rgba(255, 255, 255, 0.801);
      font-size: 20px;

      label {
        font-weight: 600;
      }

      input[type="text"] {
        height: 2rem;
        padding: 0 0.5rem;
        background-color: #383880;
        width: 100%;
        border-radius: 5px;
        color: white;
      }

      &__input--wrong {
        height: 2rem;
        padding: 0 0.5rem;
        border: 2px rgb(251, 76, 76) solid;
      }

      &__error-description {
        font-size: 11px;
        color: rgb(251, 76, 76);
      }
    }

    input[type="button"] {
      margin-top: 1rem;
      height: 3rem;
      font-size: 20px;
      color: white;
      background-color: #383880;
      border: solid 1px rgb(97, 97, 159);
      width: 100%;
      border-radius: 5px;
      cursor: pointer;
      padding: 0 4%;

      &:hover {
        background-color: rgb(97, 97, 163);
      }
    }

    &__button {
      &-group {
        display: flex;
        justify-content: space-evenly;
      }
    }
  }
}
</style>
