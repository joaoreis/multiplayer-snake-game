<template>
  <section class="gameState">
    <div class="gameState__header">
      <h1 class="gameState__title">Score: {{ score }}</h1>

      <h2 class="gameState__lobbyId">Room: {{ lobbyId }}</h2>
    </div>

    <SnakeCanvas
      :cellSize="cellSize"
      :boardSize="boardSize"
      :speed="speed"
      :stop="stop"
      @new-score="(newScore) => (score = newScore)"
    />
  </section>
</template>

<script setup>
import { ref } from "vue";
import SnakeCanvas from "@/components/GridComponent.vue";

import { useUserStore } from "@/storage/user";

const { lobbyId } = useUserStore();

const score = ref(0);

const cellSize = 15;
const boardSize = 40;
const speed = 12;
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.gameState {
  font-family: "Courier New", Courier, monospace;
  border: 2px solid #9898bb;
  font-size: 24px;
  background-color: #1a1a3886;
  border-radius: 10px;
  overflow: hidden;
  &__header {
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    color: rgba(255, 255, 255, 0.801);
    border-bottom: 2px solid #9898bb;
  }
}
</style>
