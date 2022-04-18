function handleKeyPress_aiTrain(a) {
	switch (a.key) {
		case controls_s.esc:
		case controls_s.rr:
			game_state = 0;
			game_substate = 0;
			menu_selected = 0;
			break;

		case controls_s.u:
			menu_selected = clamp(menu_selected - 1, 0, menu_buttons_ai.length-1);
			break;
		case controls_s.d:
			menu_selected = clamp(menu_selected + 1, 0, menu_buttons_ai.length-1);
			break;
		
		//Z for select
		case controls_s.rl:
			if (menu_buttons_ai[menu_selected][1] != "") {
				eval(menu_buttons_ai[menu_selected][1]);
			}
			break;

	}
}

function handleKeyPress_aiPlay(a) {
	switch (a.key) {
		case controls_s.esc:
			if (boards[0].quitTimer <= 0 || game_substate == 2) {
				game_state = 4;
				game_substate = 0;
			} else if (game_substate == 0) {
				game_substate = 2;
			}
			break;
		case controls_s.confirm:
			if (game_substate == 2) {
				game_substate = 0;
			}
			break;
		case controls_s.rl:
		case controls_s.rr:
			if (boards[0].quitTimer <= 0) {
				game_state = 4;
				game_substate = 0;
			}
			break;
	}
}

function handleKeyPress_competition(a) {

}

function handleKeyPress_game(a) {
	if (game_substate == 1) {
		if (game_endOpacity == 1) {
			game_endOpacity = 0;
			game_substate = 0;
			game_state = 0;
		}
		return;
	}

	switch (a.key) {
		//left, right, and soft drop
		case controls_s.l:
			boards[0].movePiece(-1, 0);
			break;
		case controls_s.r:
			boards[0].movePiece(1, 0);
			break;
		case controls_s.d:
			boards[0].score += +boards[0].movePiece(0, 1);
			break;

		//rotation
		case controls_s.rl:
		case controls_s.rl2:
			boards[0].twistPiece(1);
			break;
		case controls_s.rr:
			boards[0].twistPiece(-1);
			break;

		//storage
		case controls_s.st:
			boards[0].storePiece();
			break;

		//hard drop
		case controls_s.hd:
			boards[0].hardDrop();
			break;

		//escape / enter
		case controls_s.esc:
			if (game_substate == 0) {
				game_substate = 2;
			} else {
				game_state = 0;
				game_substate = 0;
			}
			break;
		case controls_s.confirm:
			if (game_substate == 2) {
				game_substate = 0;
			}
			break;
	}
}

function handleKeyPress_menu(a) {
	switch (a.key) {
		case controls_s.u:
			menu_selected = clamp(menu_selected - 1, 0, menu_selectSet.length-1);
			while (menu_selectSet[menu_selected][0] == "") {
				menu_selected = clamp(menu_selected - 1, 0, menu_selectSet.length-1);
			}
			break;
		case controls_s.d:
			menu_selected = clamp(menu_selected + 1, 0, menu_selectSet.length-1);
			while (menu_selectSet[menu_selected][0] == "") {
				menu_selected = clamp(menu_selected + 1, 0, menu_selectSet.length-1);
			}
			break;

		//Z for select
		case controls_s.rl:
			if (menu_selectSet[menu_selected][1] != "") {
				eval(menu_selectSet[menu_selected][1 + (game_substate > 0)]);
			}
			break;
		//X for cancel
		case controls_s.rr:
			if (game_substate > 0) {
				game_substate = 0;
				menu_selectSet = menu_buttons;
				menu_selected = 0;
			}
			break;
	}
}