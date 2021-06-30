#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <math.h>

#define PROJECT_NAME "Project Name"
#define SCREEN_WIDTH 800
#define SCREEN_HEIGHT 800

/*FOR COMPILATION:
g++ [this file name] -o [output file name] -lglfw -lGLEW -framework OpenGL
./[output file name]
if output file is a .app you don't need to do ./

*/
void render();
void setup();

int main() {
	double background_color[] = {1, 0, 1};
	//main vars

	GLFWwindow *window;

	// Initialize the library
	if (!glfwInit()) {
		return -1;
	}

	// Create a windowed mode window and its OpenGL context
	window = glfwCreateWindow( SCREEN_WIDTH, SCREEN_HEIGHT, PROJECT_NAME, NULL, NULL);

	// Terminate the window if it refuses to open
	if (!window) {
		glfwTerminate();
		return -1;
	}

	// Make the window's context current
	glfwMakeContextCurrent(window);
	setup();

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

void setup() {
	glClearColor(0.0, 0.0, 0.0, 1.0);
	
	// breadth of picture boundary is 1 pixel
	glPointSize(1.0);
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	
	// setting window dimension in X- and Y- direction
	gluOrtho2D(-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2, -SCREEN_HEIGHT / 2, SCREEN_HEIGHT / 2);
}

void render() {
	//loop through all pixels
}