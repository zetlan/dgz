
class UI_Button {
	constructor(x, y, width, height, text, haveLightText, codeToRunAsString) {
		this.x = x;
		this.y = y;
		this.w = width;
		this.h = height;
		this.text = text;
		this.code = codeToRunAsString;
		this.light = haveLightText;

		this.textSize = 0.04;
	}

	tick() {
		//if the cursor is down and over the button, activate
		if (this.over) {
			eval(this.code);
		}
	}

	beDrawn() {
		this.over = (cursor_x > canvas.width * (this.x - this.w / 2) && cursor_x < canvas.width * (this.x + this.w / 2) && cursor_y > canvas.height * (this.y - this.h / 2) && cursor_y < canvas.height * (this.y + this.h / 2));

		ctx.strokeStyle = (this.over && color_editor_selection) || (!this.over && color_editor_border);
		ctx.fillStyle = boolToValues(this.light, color_text_light, color_text);
		ctx.font = `${canvas.height * this.textSize}px Ubuntu`;
		ctx.textAlign = "center";
		ctx.lineWidth = 2;

		ctx.fillText(this.text, canvas.width * this.x, canvas.height * this.y);
		
		drawRoundedRectangle(canvas.width * (this.x - this.w / 2), canvas.height * (this.y - this.h / 2), canvas.width * this.w, canvas.height * this.h, canvas.height / 100);
		ctx.stroke();
	}
}