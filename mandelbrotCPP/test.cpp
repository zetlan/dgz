#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <math.h>

//for compilation: 

#define PROJECT_NAME "Project Name"
#define SCREEN_WIDTH 800
#define SCREEN_HEIGHT 800

void render();

int main() {
	double background_color[] = {0.5, 1, 1};
	//main vars

	GLFWwindow *window;

	// Initialize the library
	if (!glfwInit()) {
		return -1;
	}

	// Create a windowed mode window and its OpenGL context
	window = glfwCreateWindow( SCREEN_WIDTH, SCREEN_HEIGHT, PROJECT_NAME, NULL, NULL );

	// Terminate the window if it refuses to open
	if (!window) {
		glfwTerminate();
		return -1;
	}

	// Make the window's context current
	glfwMakeContextCurrent(window);

	// Loop until the user closes the window
	while ( !glfwWindowShouldClose(window)) {
		glClearColor(background_color[0], background_color[1], background_color[2], true);
		glClear(GL_COLOR_BUFFER_BIT);

		render();


		// Swap front and back buffers
		glfwSwapBuffers(window);

		// Poll for and process events
		glfwPollEvents();
	}

	glfwTerminate();
	return 0;
}


void render() {
	//loop through all pixels
}