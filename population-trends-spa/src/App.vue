<template>
  <div id="app">
    <h1>Population Trends by Prefecture</h1>
    <PrefectureList @prefectureSelected="handlePrefectureSelected" />
    <PopulationGraph :selectedPrefectures="selectedPrefectures" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import PrefectureList from "./components/PrefectureList.vue";
import PopulationGraph from "./components/PopulationGraph.vue";

export default defineComponent({
  name: "App",
  components: {
    PrefectureList,
    PopulationGraph,
  },
  setup() {
    const selectedPrefectures = ref<number[]>([]);

    const handlePrefectureSelected = (prefCode: number) => {
      if (selectedPrefectures.value.includes(prefCode)) {
        selectedPrefectures.value = selectedPrefectures.value.filter(
          (code) => code !== prefCode
        );
      } else {
        selectedPrefectures.value.push(prefCode);
      }
    };

    return {
      selectedPrefectures,
      handlePrefectureSelected,
    };
  },
});
</script>

<style>
/* Basic styles */
#app {
  text-align: center;
  margin: 20px;
}

h1 {
  font-size: 2rem;
}

@media (max-width: 600px) {
  h1 {
    font-size: 1.5rem;
  }
}
</style>
