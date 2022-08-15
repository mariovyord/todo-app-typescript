enum ProjectStatus {
	Active = 'active',
	Finished = 'finished',
}

// Project Type
class Project {
	readonly id: string;

	constructor(
		public title: string,
		public description: string,
		public people: number,
		public status: ProjectStatus,
	) {
		this.id = Math.random().toString();
	}
}

// ProjectState Managment
type Listener = (items: Project[]) => void;

class ProjectState {
	private listeners: Listener[] = []
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() { }

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addListener(fn: Listener) {
		this.listeners.push(fn);
	}

	addProject(title: string, description: string, people: number) {
		const newProject = new Project(
			title,
			description,
			people,
			ProjectStatus.Active
		);

		this.projects.push(newProject);

		this.listeners.forEach(fn => fn([...this.projects]));
	}
}

const projectState = ProjectState.getInstance();

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

// Project List Class
class ProjectList {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLElement;
	assignedProjects: Project[];

	constructor(private type: ProjectStatus) {
		this.assignedProjects = [];

		this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
		this.hostElement = document.getElementById('app')! as HTMLDivElement;

		const importedNode = document.importNode(this.templateElement.content, true);
		this.element = importedNode.firstElementChild as HTMLElement;
		this.element.id = `${this.type}-projects`;

		projectState.addListener((projects: Project[]) => {
			this.assignedProjects = projects.filter(x => x.status === type)
			this.renderProjects();
		})

		this.attach();
		this.renderContent();
	}

	private renderProjects() {
		const listElement = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
		listElement.innerHTML = '';
		this.assignedProjects.forEach((prj: any) => {
			const item = document.createElement('li');
			item.textContent = prj.title;
			listElement?.appendChild(item);
		})
	}

	private renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector('ul')!.id = listId;
		this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
	}

	private attach() {
		this.hostElement.insertAdjacentElement('beforeend', this.element);
	}
}

// Project Input Class
class ProjectInput {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLFormElement;
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		this.templateElement = document.getElementById('project-input') as HTMLTemplateElement;
		this.hostElement = document.getElementById('app') as HTMLDivElement;

		const importedNode = document.importNode(this.templateElement.content, true);
		this.element = importedNode.firstElementChild as HTMLFormElement;
		this.element.id = 'user-input';

		this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
		this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
		this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

		this.configure();
		this.attach();
	}

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

	@Autobind
	private configure() {
		this.element.addEventListener('submit', this.handleSubmit);
	}

	private attach() {
		this.hostElement.insertAdjacentElement('afterbegin', this.element);
	}
}

(function start() {
	new ProjectInput();
	new ProjectList(ProjectStatus.Active);
	new ProjectList(ProjectStatus.Finished);
})()
