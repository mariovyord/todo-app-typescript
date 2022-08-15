namespace App {
	// ProjectState Managment
	type Listener<T> = (items: T[]) => void;

	class State<T> {
		protected listeners: Listener<T>[] = []

		addListener(fn: Listener<T>) {
			this.listeners.push(fn);
		}
	}

	export class ProjectState extends State<Project> {
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

	export const projectState = ProjectState.getInstance();
}