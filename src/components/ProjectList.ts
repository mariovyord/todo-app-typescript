namespace App {
	export // Project List Class
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
}