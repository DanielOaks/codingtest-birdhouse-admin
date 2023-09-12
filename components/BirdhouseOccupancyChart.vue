<template>
  <Line id="occupancy-line-chart" :options="chartOptions" :data="chartData" />
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-spacetime";
import { OccupancyState } from "@/stores/birdhouses";

// props
const props = defineProps<{ states: OccupancyState[] }>();

// chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
);

const chartData = computed(() => {
  // get all *unique* entries only, since the API can duplicate info.
  // this speeds up rendering a fair bit and also makes it display cleaner
  const eggData = [
    ...new Set(
      props.states.map((info) => {
        return JSON.stringify({
          x: info.createdAt.toUTCString(),
          y: info.eggs,
        });
      }),
    ),
  ].map((info) => JSON.parse(info));

  const birdData = [
    ...new Set(
      props.states.map((info) => {
        return JSON.stringify({
          x: info.createdAt.toUTCString(),
          y: info.birds,
        });
      }),
    ),
  ].map((info) => JSON.parse(info));

  return {
    datasets: [
      {
        label: "Eggs",
        borderWidth: 2,
        borderColor: "#744F99",
        backgroundColor: "#744F9930",
        pointBackgroundColor: "transparent",
        fill: "origin",
        data: eggData,
        cubicInterpolationMode: "monotone",
      },
      {
        label: "Birds",
        borderWidth: 2,
        borderColor: "#0E9CFF",
        backgroundColor: "#0E9CFF30",
        pointBackgroundColor: "transparent",
        fill: "origin",
        data: birdData,
        cubicInterpolationMode: "monotone",
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    filler: true,
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      type: "time",
      ticks: {
        autoSkip: true,
        maxTicksLimit: 7,
        padding: 8,
      },
      border: {
        dash: [5, 2],
      },
      grid: {
        color: "rgba(255,255,255,.2)",
        tickLength: 0,
      },
    },
    y: {
      ticks: {
        autoSkip: true,
        beginAtZero: true,
        padding: 8,
        callback: (value: number) => {
          if (value % 1 === 0) {
            return value;
          }
        },
      },
      border: {
        dash: [5, 2],
      },
      grid: {
        color: "rgba(255,255,255,.2)",
        tickLength: 0,
      },
    },
  },
};
</script>
