<template>
    <div>
      <h2>Select Prefectures</h2>
      <div class="prefecture-list">
        <div
          class="prefecture-item"
          v-for="prefecture in prefectures"
          :key="prefecture.prefCode"
        >
          <label>
            <input
              type="checkbox"
              :value="prefecture.prefCode"
              @change="togglePrefecture(prefecture.prefCode)"
            />
            {{ prefecture.prefName }}
          </label>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from "vue";
  import { getPrefectures, Prefecture } from "@/services/resasApi";
  
  export default defineComponent({
    name: "PrefectureList",
    emits: ["prefectureSelected"],
    setup(_, { emit }) {
      const prefectures = ref<Prefecture[]>([]);
  
      const fetchPrefectures = async () => {
        try {
          prefectures.value = await getPrefectures();
        } catch (error) {
          console.error("Failed to load prefectures");
        }
      };
  
      const togglePrefecture = (prefCode: number) => {
        emit("prefectureSelected", prefCode);
      };
  
      onMounted(fetchPrefectures);
  
      return {
        prefectures,
        togglePrefecture,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Minimal responsive styles */
  div {
    margin: 10px;
  }
  
  label {
    display: inline-block;
    margin-bottom: 5px;
  }
  
  .prefecture-list {
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(90px, 1fr)
    ); /* Responsive grid */
    gap: 10px; /* Spacing between grid items */
  }
  
  .prefecture-item {
    display: flex;
    align-items: center;
  }
  </style>
  