namespace App {
	export enum ProjectStatus {
		Active = 'active',
		Finished = 'finished',
	}

	// Project Type
	export class Project {
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
}