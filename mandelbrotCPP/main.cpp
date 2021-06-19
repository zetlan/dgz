#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <math.h>
#include <iostream>
#include <chrono>
#include <thread>

using namespace std;

//compiler replacements
#define name "Mandelbrot render"
#define width 640
#define height 480
#define pi 3.14159265358979

//constants (yes these are different no don't worry about it)
const int numThreads = 4;

//changing variables
int maxIterations = 255;
float scale = 100.0;
float scaleFactor = 1.1;
double xOffset = -0.07487076188491468;
double yOffset = 0.9706526589050497;

void render();
void renderSingleThreaded();
void renderMultiThreaded();
void setup();

void handleKeyPress(unsigned char key, int x, int y);
void handleMouseClick(int button, int state, int x, int y);


//class for thread computation
class MandelCompute {
	public:
		int rowStart;
		int rowJumpBy;
		MandelCompute() {

		}
		
		MandelCompute(int startingRow, int jumpBy) {
			this->rowStart = startingRow;
			this->rowJumpBy = jumpBy;
		}

		void run() {
			cout << "creating thread" << endl;
			thread t1([this] {this->doRows();});
			cout << "created thread!" << endl;
			//this->doRows();
		}
	private:
		void doRows() {
			//cout << "starting row drawing" << endl;
			for (int y=this->rowStart; y<height/2; y+=this->rowJumpBy) {
				this->drawRow(y);
			}
			//cout << "row drawing finished" << endl;
		}

		void drawRow(int y) {
			int i;
			double zx;
			double zy;
			double xt;
			double newX;
			double newY;
			for (int x=-width; x<width; x++) {
				//computation for a pixel
				newX = ((double)x / scale) + xOffset;
				newY = ((double)y / scale) + yOffset;
				
				i = 0;
				zx = 0;
				zy = 0;
				xt = 0;
				//iterate
				while (i < maxIterations && zx * zx + zy * zy < 4) {
					i += 1;
					//xt = z
					xt = zx * zy;
					//z = z^2 + c
					zx = zx * zx - zy * zy + newX;
					zy = 2 * xt + newY;
				}
				glColor3f((1.0 * i) / maxIterations, (1.0 * i) / maxIterations, (1.0 * i) / maxIterations);
				glVertex2i(x, y);
			}
		}
};
MandelCompute computeListing[numThreads] = {};

int main() {
	cout << "main starting" << endl;
	double background_color[] = {0.5, 1, 1};
	double scale = 200.0;
	//main vars

	GLFWwindow *window;

	// Initialize the library
	if (!glfwInit()) {
		return -1;
	}

	// Create a windowed mode window and its OpenGL context
	window = glfwCreateWindow(width, height, name, NULL, NULL);

	// Terminate the window if it refuses to open
	if (!window) {
		glfwTerminate();
		return -1;
	}

	// Make the window's context current
	glfwMakeContextCurrent(window);

	cout << "window init" << endl;

	//setup function
	setup();
	cout << "setup complete" << endl;

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

	//doubled size for retina displays
	glPointSize(2.0);
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();

	//fix computing array
	for (int i=0; i<numThreads; i++) {
		computeListing[i].rowStart = (-height / 2) + i;
		computeListing[i].rowJumpBy = numThreads;
	}
	
	//set up coordinate system
	gluOrtho2D(width / -2, width / 2, height / -2, height / 2);
}


void render() {
	cout << "starting main render method" << endl;
	scale *= scaleFactor;
	//loop through all pixels
	glClearColor(0.0, 0.0, 0.0, 1.0);
	glClear(GL_COLOR_BUFFER_BIT);
	glBegin(GL_POINTS);

	cout << "branching" << endl;
	//renderSingleThreaded();
	renderMultiThreaded();

	
	cout << "complete??" << endl;
	glEnd();
	glFlush();
}

void renderSingleThreaded() {
}

void renderMultiThreaded() {
	cout << "starting mult render" << endl;
	for (int i=0; i<numThreads; i++) {
		computeListing[i].run();
	}
}

void drawRow(int y) {
}

void handleKeyPress(unsigned char key, int x, int y) {

}

void handleMouseClick(int button, int state, int x, int y) {
	scale = scale * 1.5;
}