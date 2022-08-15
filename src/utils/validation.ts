namespace App {
	// Validation
	export interface Validatable {
		value: string | number;
		required?: boolean,
		minLength?: number,
		maxLength?: number,
		min?: number,
		max?: number,
	}

	export function validate(obj: Validatable) {
		if (obj.required) {
			if (obj.value.toString().length === 0) return false;
		}

		if (obj.minLength != null && typeof obj.value === 'string') {
			if (obj.value.length < obj.minLength) return false;
		}

		if (obj.maxLength != null && typeof obj.value === 'string') {
			if (obj.value.length > obj.maxLength) return false;
		}

		if (obj.min != null && typeof obj.value === 'number') {
			if (obj.value < obj.min) return false;
		}

		if (obj.max != null && typeof obj.value === 'number') {
			if (obj.value > obj.max) return false;
		}

		return true;
	}

}