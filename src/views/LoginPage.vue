<template>
  <section class="login container">
    <div class="login__card">
      <form class="login__form">
        <div class="login__form-group">
          <label for="nick">Digite seu Nick</label>
          <input type="text" name="nick" v-model="userId" required />
        </div>
        <div class="login__form-group">
          <label for="roomName">Digite o nome da Sala</label>
          <input type="text" name="roomName" v-model="roomName" />
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

const { nickname, setUserId, setSocket } = useUserStore();

const userId = ref(nickname.value ?? "");
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
  router.push({ name: "game" });
};

// eslint-disable-next-line no-undef
state.socket = io("http://192.168.15.10:3000");
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
