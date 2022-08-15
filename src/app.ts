// Drag and Drom interfaces
interface Draggable {
	handleDragStart(e: DragEvent): void;
	handleDragEnd(e: DragEvent): void;
}

interface DragTarget {
	handleDragOver(e: DragEvent): void;
	handleDrop(e: DragEvent): void;
	handleDragLeave(e: DragEvent): void;
}

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
type Listener<T> = (items: T[]) => void;

class State<T> {
	protected listeners: Listener<T>[] = []

	addListener(fn: Listener<T>) {
		this.listeners.push(fn);
	}
}

class ProjectState extends State<Project> {
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addProject(title: string, description: string, people: number) {
		const newProject = new Project(
			title,
			description,
			people,
			ProjectStatus.Active
		);

		this.projects.push(newProject);

		this.updateListeners();
	}

	moveProject(projectId: string, newStatus: ProjectStatus) {
		const project = this.projects.find(x => x.id === projectId);
		if (project && project.status !== newStatus) {
			project.status = newStatus;
			this.updateListeners();
		}
	}

	private updateListeners() {
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

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	templateElement: HTMLTemplateElement;
	hostElement: T;
	element: U;

	constructor(
		templateId: string,
		hostElementId: string,
		insertAtStart: boolean,
		newElementId?: string,
	) {
		this.templateElement = document.getElementById(templateId) as HTMLTemplateElement;
		this.hostElement = document.getElementById(hostElementId) as T;

		const importedNode = document.importNode(this.templateElement.content, true);
		this.element = importedNode.firstElementChild as U;
		if (newElementId) {
			this.element.id = newElementId;
		}
		this.attach(insertAtStart);
	}

	private attach(insertAtStart: boolean) {
		this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element);
	}

	abstract configure(): void;
	abstract renderContent(): void;
}

// Project Item Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
	private project: Project;

	get persons() {
		if (this.project.people === 1) {
			return '1 person'
		} else {
			return `${this.project.people} persons`
		}
	}

	constructor(hostId: string, project: Project) {
		super(
			'single-project',
			hostId,
			false,
			project.id,
		);

		this.project = project;

		this.configure();
		this.renderContent();
	}

	@Autobind
	handleDragEnd(e: DragEvent): void {
		console.log(e);
	}

	@Autobind
	handleDragStart(e: DragEvent): void {
		e.dataTransfer!.setData('text/plain', this.project.id);
		e.dataTransfer!.effectAllowed = 'move';
	}

	configure(): void {
		this.element.addEventListener('dragstart', this.handleDragStart);
		this.element.addEventListener('dragend', this.handleDragEnd);
	}

	renderContent() {
		this.element.querySelector('h2')!.textContent = this.project.title;
		this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
		this.element.querySelector('p')!.textContent = this.project.description;
	}
}

// Project List Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
	assignedProjects: Project[];

	constructor(private type: ProjectStatus) {
		super(
			'project-list',
			'app',
			false,
			`${type}-projects`
		);

		this.assignedProjects = [];

		this.configure();
		this.renderContent();
	}

	@Autobind
	handleDragLeave(_: DragEvent): void {
		const listElement = this.element.querySelector('ul')!;
		listElement.classList.remove('droppable');
	}

	@Autobind
	handleDragOver(e: DragEvent): void {
		if (e.dataTransfer && e.dataTransfer.types[0] === 'text/plain') {
			e.preventDefault();
			const listElement = this.element.querySelector('ul')!;
			listElement.classList.add('droppable');
		}
	}

	@Autobind
	handleDrop(e: DragEvent): void {
		e.preventDefault();
		const projectId = e.dataTransfer!.getData('text/plain');
		projectState.moveProject(projectId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
	}

	configure(): void {
		this.element.addEventListener('dragover', this.handleDragOver);
		this.element.addEventListener('dragleave', this.handleDragLeave);
		this.element.addEventListener('drop', this.handleDrop);

		projectState.addListener((projects: Project[]) => {
			this.assignedProjects = projects.filter(x => x.status === this.type)
			this.renderProjects();
		})
	}

	private renderProjects() {
		const listElement = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
		listElement.innerHTML = '';
		this.assignedProjects.forEach((prj: any) => {
			new ProjectItem(
				this.element.querySelector('ul')!.id,
				prj,
			)
		})
	}

	renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector('ul')!.id = listId;
		this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
	}

}

// Project Input Class
class ProjectInput extends Component<HTMLDivElement, HTMLElement> {
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

(function start() {
	new ProjectInput();
	new ProjectList(ProjectStatus.Active);
	new ProjectList(ProjectStatus.Finished);
})()
