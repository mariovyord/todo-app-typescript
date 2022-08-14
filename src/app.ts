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
		const people = this.peopleInputEl.value.trim();

		if (title.length === 0 || description.length === 0 || people.length === 0) {
			return alert('Fill all fields!')
		}

		return [title, description, parseInt(people)];
	}

	@Autobind
	private handleSubmit(e: Event) {
		e.preventDefault();
		const userInput = this.gatherUserInput();

		if (Array.isArray(userInput)) {
			const [title, description, people] = userInput;
			console.log(title, description, people);
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
