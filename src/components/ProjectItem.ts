namespace App {
	export // Project Item Class
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
}