<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  labels: string[]
  values: number[]
  colors?: string[]
}>()

const defaultColors = [
  '#6c63ff', '#22c55e', '#ef4444', '#f59e0b',
  '#3b82f6', '#ec4899', '#14b8a6', '#f97316',
]

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: props.colors ?? defaultColors,
      borderColor: 'transparent',
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
}))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#8b8b9e',
        padding: 16,
        boxWidth: 12,
        font: { size: 12 },
      },
    },
    tooltip: {
      callbacks: {
        label(ctx) {
          const val = ctx.parsed as number
          return ` $${val.toFixed(2)}`
        },
      },
    },
  },
}
</script>

<template>
  <div class="chart-container">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 260px;
}
</style>
