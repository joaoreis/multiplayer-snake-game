<template>
  <section class="gameState">
    <div class="gameState__header">
      <h1 class="gameState__title">Snake Game</h1>

      <h2 class="gameState__lobbyId">
        {{ lobbyId }}
      </h2>
    </div>

    <SnakeCanvas
      :cellSize="cellSize"
      :boardSize="boardSize"
      :speed="speed"
      :stop="stop"
      :addScores="addScores"
    />
  </section>
</template>

<script setup>
import SnakeCanvas from "@/components/GridComponent.vue";

import { useUserStore } from "@/storage/user";

const { lobbyId } = useUserStore();

const cellSize = 20;
const boardSize = 40;
const speed = 12;
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.gameState {
  font-family: "Courier New", Courier, monospace;
  font-size: 24px;

  &__header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
