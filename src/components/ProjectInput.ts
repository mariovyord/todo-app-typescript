namespace App {
	// Project Input Class
	export class ProjectInput extends Component<HTMLDivElement, HTMLElement> {
		titleInputElement: HTMLInputElement;
		descriptionInputElement: HTMLInputElement;
		peopleInputElement: HTMLInputElement;

		constructor() {
			super(
				'project-input',
				'app',
				true,
				'user-input',
			);

			this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
			this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
			this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

			this.configure();
		}

		@Autobind
		configure() {
			this.element.addEventListener('submit', this.handleSubmit);
		}

		renderContent(): void { }

		private gatherUserInput(): [string, string, number] | void {
			const title = this.titleInputElement.value.trim();
			const description = this.descriptionInputElement.value.trim();
			const people = parseInt(this.peopleInputElement.value.trim());

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
			this.titleInputElement.value = '';
			this.descriptionInputElement.value = '';
			this.peopleInputElement.value = '';
		}

		@Autobind
		private handleSubmit(e: Event) {
			e.preventDefault();
			const userInput = this.gatherUserInput();

			if (Array.isArray(userInput)) {
				const [title, description, people] = userInput;

				projectState.addProject(title, description, people);

				this.clearInputs();
			}
		}
	}
}