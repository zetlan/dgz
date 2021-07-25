
function editor_selectExit() {
	var exit = Math.floor(((cursor_y / canvas.height) - 0.21) / 0.04);
	if (loading_map.connections[exit] != undefined) {
		editor_exitSelected = exit;
	}
}
