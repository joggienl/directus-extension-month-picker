<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { addYears, compareAsc, format, parse, subYears } from 'date-fns'
import { getDateFNSLocale } from '../utils/get-date-fns-locale.js'

const props = defineProps({
	modelValue: null,
})

const emit = defineEmits(['update:modelValue', 'close'])

const {
	t,
	locale: { value: locale },
} = useI18n()

const selectedDate = ref(null)
const currentYear = ref(null)

const thisYearThisMonth = computed(() => {
	const today = new Date()
	return new Date(today.getFullYear(), today.getMonth(), 1)
})

const months = computed(() => {
	const year = currentYear?.value?.getFullYear() || new Date().getFullYear()
	const result = []
	for (let month = 0; month < 12; month += 1) {
		result.push(new Date(year, month))
	}
	return result
})

const years = computed(() => {
	return [
		subYears(currentYear.value, 1),
		currentYear.value,
		addYears(currentYear.value, 1),
	]
})

onBeforeMount(() => {
	watch(
		() => props.modelValue,
		() => {
			if (props.modelValue) {
				selectedDate.value = parse(
					props.modelValue,
					'yyyy-MM-dd',
					new Date(),
				)
				currentYear.value = new Date(
					selectedDate.value.getFullYear(),
					0,
				)
			} else {
				currentYear.value = new Date(new Date().getFullYear(), 0)
			}
		},
		{ immediate: true },
	)
})

function yearUp() {
	currentYear.value = addYears(currentYear.value, 1)
}

function yearDown() {
	currentYear.value = subYears(currentYear.value, 1)
}

function pickYear(year) {
	currentYear.value = year
}

function isActiveMonth(month) {
	if (!selectedDate.value) return false
	return compareAsc(month, selectedDate.value) === 0
}

function selectMonth(month) {
	if (!month) emit('update:modelValue', null)
	emit('update:modelValue', format(month, 'yyyy-MM-dd'))
	emit('close')
}
</script>

<template>
	<div ref="wrapper" class="picker">
		<div class="grid">
			<div class="years">
				<button class="button year_updown" @click="yearDown">
					<v-icon :name="'keyboard_arrow_up'" />
				</button>
				<button
					v-for="(year, index) in years"
					:key="index"
					class="button year"
					:class="{ active: compareAsc(year, currentYear) === 0 }"
					@click="[0, 2].includes(index) && pickYear(year)"
				>
					{{ year.getFullYear() }}
				</button>
				<button class="button year_updown" @click="yearUp">
					<v-icon :name="'keyboard_arrow_down'" />
				</button>
			</div>
			<div class="months_wrapper">
				<div class="months">
					<button
						v-for="(month, index) in months"
						:key="index"
						class="button month"
						:class="{ active: isActiveMonth(month) }"
						@click="selectMonth(month)"
					>
						{{
							format(month, 'MMMM', {
								locale: getDateFNSLocale(locale),
							})
						}}
					</button>
				</div>
			</div>
		</div>
		<div class="bottom now">
			<button class="button now" @click="selectMonth(thisYearThisMonth)">
				{{ t('interfaces.datetime.set_to_now') }}
			</button>
		</div>
	</div>
</template>

<style scoped>
.picker .input {
	display: none;
}

.picker .bottom.now {
	border-top: var(--theme--border-width) solid
		var(--theme--border-color-subdued);
	color: var(--theme--primary);
	margin-top: 8px;
	padding-top: 8px;
}

.picker .grid {
	display: grid;
	gap: 10px;
	grid-template-columns: 80px auto;
}

.picker .years {
	display: grid;
	gap: 6px;
	grid-template-columns: 1fr;
	grid-template-rows: repeat(5, 1fr);
	justify-items: center;
}

.picker .months_wrapper {
	align-items: center;
	border-left: var(--theme--border-width) solid
		var(--theme--border-color-subdued);
	display: flex;
	flex-wrap: nowrap;
	justify-content: center;
	padding-left: 12px;
}

.picker .months {
	display: grid;
	gap: 6px;
	grid-template-columns: repeat(2, 1fr);
	min-width: 100%;
}

.picker .button {
	border-color: transparent;
	border-radius: 15px;
	border-style: solid;
	border-width: var(--theme--border-width);
	width: 100%;
}

.picker .button:hover {
	background: var(--theme--background-normal);
}

.picker .button.active {
	color: var(--theme--primary-background);
	background: var(--theme--primary);
	border-color: var(--theme--primary);
}

.picker .button.year {
	padding: 5px 0;
}

.picker .button.month {
	padding: 5px 10px;
}

.picker .button.now {
	padding: 5px 0;
}

@media screen and (min-width: 560px) {
	.picker .grid {
		gap: 12px;
		grid-template-columns: 100px auto;
	}

	.picker .months {
		grid-template-columns: repeat(3, 1fr);
		min-width: 80%;
	}
}
</style>
