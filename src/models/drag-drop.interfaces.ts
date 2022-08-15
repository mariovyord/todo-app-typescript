// Drag and Drom interfaces
namespace App {
	export interface Draggable {
		handleDragStart(e: DragEvent): void;
		handleDragEnd(e: DragEvent): void;
	}

	export interface DragTarget {
		handleDragOver(e: DragEvent): void;
		handleDrop(e: DragEvent): void;
		handleDragLeave(e: DragEvent): void;
	}
}
