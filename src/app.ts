// Validation
interface Validatable {
	value: string | number;
	required?: boolean,
	minLength?: number,
	maxLength?: number,
	min?: number,
	max?: number,
}

function validate(obj: Validatable) {
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

// Autobind decorator
function Autobind(
	_: any,
	_2: string,
	descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value;
	const adjDescriptor: PropertyDescriptor = {
		configurable: true,
		get() {
			const boundFn = originalMethod.bind(this);
			return boundFn;
		}
	}
	return adjDescriptor;
}

// Project Input Class
class ProjectInput {
	templateEl: HTMLTemplateElement;
	hostEl: HTMLDivElement;
	element: HTMLFormElement;
	titleInputEl: HTMLInputElement;
	descriptionInputEl: HTMLInputElement;
	peopleInputEl: HTMLInputElement;

	constructor() {
		this.templateEl = document.getElementById('project-input') as HTMLTemplateElement;
		this.hostEl = document.getElementById('app') as HTMLDivElement;

		const importedNode = document.importNode(this.templateEl.content, true);
		this.element = importedNode.firstElementChild as HTMLFormElement;
		this.element.id = 'user-input';

		this.titleInputEl = this.element.querySelector('#title') as HTMLInputElement;
		this.descriptionInputEl = this.element.querySelector('#description') as HTMLInputElement;
		this.peopleInputEl = this.element.querySelector('#people') as HTMLInputElement;

		this.configure();
		this.attach();
	}

	private gatherUserInput(): [string, string, number] | void {
		const title = this.titleInputEl.value.trim();
		const description = this.descriptionInputEl.value.trim();
		const people = parseInt(this.peopleInputEl.value.trim());

		const titleValidatable: Validatable = {
			value: title,
			required: true,
			minLength: 2,
		}
		const descriptionValidatable: Validatable = {
			value: description,
			required: true,
			minLength: 5,
			maxLength: 20,
		}
		const peopleValidatable: Validatable = {
			value: people,
			required: true,
			min: 1,
			max: 5,
		}

		if (
			validate(titleValidatable) === false ||
			validate(descriptionValidatable) === false ||
			validate(peopleValidatable) === false
		) {
			return alert('Enter valid values!')
		}

		return [title, description, people];
	}

	private clearInputs() {
		this.titleInputEl.value = '';
		this.descriptionInputEl.value = '';
		this.peopleInputEl.value = '';
	}

	@Autobind
	private handleSubmit(e: Event) {
		e.preventDefault();
		const userInput = this.gatherUserInput();

		if (Array.isArray(userInput)) {
			const [title, description, people] = userInput;
			console.log(title, description, people);
			this.clearInputs();
		}
	}

	@Autobind
	private configure() {
		this.element.addEventListener('submit', this.handleSubmit);
	}

	private attach() {
		this.hostEl.insertAdjacentElement('afterbegin', this.element);
	}
}

const prjInput = new ProjectInput();
