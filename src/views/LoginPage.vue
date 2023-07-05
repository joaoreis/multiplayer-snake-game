<template>
  <section class="login container">
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

// eslint-disable-next-line no-undef
state.socket = io("https://fangandfriends-backend.onrender.com");

state.socket.on("joinedLobby", function ({ lobbyId }) {
  console.log(lobbyId);
  setLobbyId(lobbyId);
  router.push({ name: "game" });
});

state.socket.on("invalidLobbyId", () => (lobbyWrong.value = true));

state.socket.on("invalidUser", () => (userWrong.value = true));

state.socket.on("gameAlreadyStarted", () => {
  lobbyWrong.value = true;
  console.log("gameAlreadyStarted");
});

state.socket.on("tooManyPlayers", () => {
  lobbyWrong.value = true;
  console.log("tooManyPlayers");
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
  background-color: rgb(230, 230, 230);
}
.login {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  &__card {
    background-color: white;
    padding: 8% 8%;
  }

  &__form {
    &-group {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 1rem;

      label {
        font-weight: 600;
      }

      input[type="text"] {
        height: 2rem;
        padding: 0 0.5rem;
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
      height: 2rem;
      color: white;
      background-color: rgb(119, 119, 195);
      border: solid 1px rgb(97, 97, 159);
      border-radius: 5px;
      cursor: pointer;
      padding: 0 4%;

      &:hover {
        background-color: rgb(131, 131, 215);
      }
    }
  }

  &__button {
    &-group {
      display: flex;
      justify-content: space-evenly;
    }
  }
}
</style>
