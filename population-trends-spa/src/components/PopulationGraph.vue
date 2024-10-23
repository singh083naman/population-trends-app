<template>
    <div class="population-graph">
      <div v-if="loading" class="loading-indicator">
        Loading population data, please wait...
      </div>
      <highcharts :options="chartOptions" v-if="!loading"></highcharts>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch, onMounted, PropType } from "vue";
  import {
    getPopulationComposition,
    getPrefectures,
    PopulationData,
    Prefecture,
  } from "@/services/resasApi";
  
  interface SeriesData {
    name: string;
    data: { x: number; y: number }[];
  }
  
  export default defineComponent({
    name: "PopulationGraph",
    props: {
      selectedPrefectures: {
        type: Array as PropType<number[]>, // Explicitly define the type of the prop
        required: true,
      },
    },
    setup(props) {
      const chartOptions = ref({
        title: {
          text: "Population Trends by Prefecture",
        },
        xAxis: {
          title: { text: "Year" },
          type: "category",
        },
        yAxis: {
          title: { text: "Population" },
        },
        series: [] as SeriesData[],
      });
  
      const allPopulationData = ref<Record<number, PopulationData[]>>({});
      const loading = ref<boolean>(true);
      const prefectureNames = ref<Record<number, string>>({});
  
      // Fetch population data for all prefectures on mount
      const fetchAllPopulationData = async () => {
        loading.value = true;
        const fetchedData: Record<number, PopulationData[]> = {};
  
        const prefectureList: Prefecture[] = await getPrefectures();
  
        prefectureList.forEach((pref) => {
          prefectureNames.value[pref.prefCode] = pref.prefName;
        });
  
        for (const prefecture of prefectureList) {
          const prefCode = prefecture.prefCode;
          fetchedData[prefCode] = await getPopulationComposition(prefCode);
        }
  
        allPopulationData.value = fetchedData;
        loading.value = false;
      };
  
      const updateChart = async () => {
        const series: SeriesData[] = [];
  
        chartOptions.value.series = [];
  
        for (const prefCode of props.selectedPrefectures) {
          if (allPopulationData.value[prefCode]) {
            const data = allPopulationData.value[prefCode].map((item) => ({
              x: item.year,
              y: item.value,
            }));
            series.push({
              name: prefectureNames.value[prefCode],
              data,
            });
          }
        }
        chartOptions.value.series = series;
      };
  
      watch(
        () => props.selectedPrefectures,
        () => {
          updateChart();
        },
        { deep: true }
      );
  
      onMounted(async () => {
        await fetchAllPopulationData();
        updateChart();
      });
  
      return {
        chartOptions,
        loading,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Styles for graph */
  .loading-indicator {
    text-align: center;
    font-size: 16px;
    margin: 20px 0;
    color: #888; /* Optional styling for loading text */
  }
  
  .population-graph {
    width: 100%;
    max-width: 600px;
    margin: auto;
  }
  </style>
  