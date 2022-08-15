/// <reference path="./models/drag-drop.interfaces.ts" />
/// <reference path="./models/project.model.ts" />

/// <reference path="./state/project.state.ts" />
/// <reference path="./utils/validation.ts" />
/// <reference path="./decorators/autobind.ts" />

// Components
/// <reference path="./components/Component.ts" />
/// <reference path="./components/ProjectInput.ts" />
/// <reference path="./components/ProjectItem.ts" />
/// <reference path="./components/ProjectList.ts" />

namespace App {
	(function start() {
		new ProjectInput();
		new ProjectList(ProjectStatus.Active);
		new ProjectList(ProjectStatus.Finished);
	})()
}