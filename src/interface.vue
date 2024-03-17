<script setup>
import { isValid, parse, format } from 'date-fns';
import { useI18n } from 'vue-i18n'
import {computed, onBeforeMount, ref, watch} from 'vue';

import {
	getDateFNSLocale,
	loadDateFNSLocale
} from './utils/get-date-fns-locale.js';
import Picker from './components/picker.vue';

const props = defineProps({
	value: String,
	disabled: Boolean,
})

const emit = defineEmits(['input'])
const i18n = useI18n();
const { t, locale: { value: locale } } = i18n;
const { displayValue, isValidValue } = useDisplayValue();

const monthPickerMenu = ref(null);

onBeforeMount(async() => {
	// Based on the current locale, we load some date-fns locale files
	await loadDateFNSLocale(locale);
})

function useDisplayValue() {
	const displayValue = ref(null);
	const isValidValue = computed(() => (props.value ? isValid(parseValue(props.value)) : false));
	watch(() => props.value, setDisplayValue, {immediate: true});
	return {displayValue, isValidValue};

	function setDisplayValue() {
		if (!props.value || !isValidValue.value) {
			displayValue.value = null;
			return;
		}
		displayValue.value = format(parseValue(props.value), 'MMMM yyyy', {
			locale: getDateFNSLocale(locale)
		})
	}

	function parseValue(value) {
		return parse(value, 'yyyy-MM-dd', new Date());
	}
}

function unsetValue(event) {
	event.preventDefault();
	event.stopPropagation();
	emit('input', null);
}
</script>

<template>
	<v-menu ref="monthPickerMenu" :close-on-content-click="false" attached :disabled="disabled" full-height seamless>
		<template #activator="{ toggle, active }">
			<v-input
				:active="active"
				clickable
				readonly
				:model-value="displayValue"
				:disabled="disabled"
				:placeholder="t('enter_a_value')"
				@click="toggle"
			>
				<template v-if="!disabled" #append>
					<v-icon
						:name="value ? 'clear' : 'today'"
						:class="{ active, 'clear-icon': value, 'today-icon': !value }"
						v-on="{ click: value ? unsetValue : null }"
					/>
				</template>
			</v-input>
		</template>
		<v-list>
			<v-list-item>
				<v-list-item-content>
					<Picker
						:disabled="disabled"
						:model-value="value"
						@update:model-value="$emit('input', $event)"
						@close="monthPickerMenu?.deactivate"
					/>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<style scoped>
.v-icon.today-icon:hover,
.v-icon.today-icon.active {
	--v-icon-color: var(--theme--primary);
}

.v-icon.clear-icon:hover,
.v-icon.clear-icon.active {
	--v-icon-color: var(--theme--danger);
}
</style>
