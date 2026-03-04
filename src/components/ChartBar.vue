<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps<{
  labels: string[]
  datasets: {
    label: string
    data: number[]
    color: string
  }[]
  yPrefix?: string
  height?: number
  stacked?: boolean
}>()

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: props.labels,
  datasets: props.datasets.map((d) => ({
    label: d.label,
    data: d.data,
    backgroundColor: d.color,
    borderRadius: 4,
    borderSkipped: false,
  })),
}))

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
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
          const prefix = props.yPrefix ?? ''
          return ` ${ctx.dataset.label}: ${prefix}${(ctx.parsed.y as number).toFixed(2)}`
        },
      },
    },
  },
  scales: {
    x: {
      stacked: props.stacked,
      grid: { color: '#2e2e3a' },
      ticks: { color: '#8b8b9e', font: { size: 11 } },
    },
    y: {
      stacked: props.stacked,
      grid: { color: '#2e2e3a' },
      ticks: {
        color: '#8b8b9e',
        font: { size: 11 },
        callback(val) {
          return `${props.yPrefix ?? ''}${(val as number).toFixed(0)}`
        },
      },
    },
  },
}))
</script>

<template>
  <div class="chart-container" :style="{ height: `${height ?? 240}px` }">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}
</style>
