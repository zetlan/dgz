#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <math.h>
#include <iostream>
#include <chrono>
#include <thread>
#include <cstdlib>

#include <unistd.h>

using namespace std;

//compiler replacements
#define width 640
#define height 480
#define pi 3.14159265358979

//constants (yes these are different no don't worry about it)
const int numThreads = 7;

//changing variables
bool doMaxIncrease = false;
int threadsFinished = 0;
int maxIterations = 255;
float scale = 100.0;
float scaleFactor = 1.1;
double xOffset = -0.07487076188491468;
double yOffset = 0.9706526589050497;

int pixelArr[height][width];

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
			thread t1 = thread([this] {this->doRows();});
			t1.detach();
		}
		void doRows() {
			for (int y=this->rowStart; y<height/2; y+=this->rowJumpBy) {
				//cout << "would call drawRow()" << endl;
				this->drawRow(y);
			}
			threadsFinished += 1;
		}

		void drawRow(int y) {
			int i;
			long double zx;
			long double zy;
			long double xt;
			long double newX;
			long double newY;
			for (int x=-width/2; x<width/2; x++) {
				//computation for a pixel
				newX = ((long double)x / scale) + xOffset;
				newY = ((long double)y / scale) + yOffset;
				
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
				pixelArr[y+(height/2)][x+(width/2)] = i;
			}
		}
};
MandelCompute computeListing[numThreads] = {};

void doAThing() {
	cout << "This is a thing I guess" << endl;
}

int main() {
	cout << "main starting" << endl;
	double background_color[] = {0.5, 1, 1};
	double scale = 200.0;
	//main vars

	GLFWwindow *window;

	thread zthread(&doAThing);

	// Initialize the library
	if (!glfwInit()) {
		return -1;
	}

	// Create a windowed mode window and its OpenGL context
	window = glfwCreateWindow(width, height, "Mandelbrot render", NULL, NULL);

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
	scale *= scaleFactor;
	//loop through all pixels
	glClearColor(0.0, 0.0, 0.0, 1.0);
	glClear(GL_COLOR_BUFFER_BIT);
	glBegin(GL_POINTS);

	threadsFinished = 0;
	for (int i=0; i<numThreads; i++) {
		computeListing[i].run();
	}

	//wait until all threads are done, then draw
	while (threadsFinished < numThreads) {
		//1/50th second
		usleep(20);
	}

	// //now draw everything
	float compound = 0.6 * 0.75;
	float invCompound = 0.6 * 0.25;
	for (int x=0; x<width; x++) {
		for (int y=0; y<height; y++) {
			//actually drawing pixel
			if (pixelArr[y][x] == maxIterations) {
				doMaxIncrease = true;
				glColor3f(0, 0, 0);
			} else {
				//get RGB value from iterations
				float mystery1 = compound * (1 - abs(fmod(4.0 * pixelArr[y][x] / 60, 2) - 1));

				switch((int)(floor(4.0 * pixelArr[y][x] / 60))) {
					case 0:
						glColor3f(compound + invCompound, mystery1 + invCompound, invCompound);
						break;
					case 1:
						glColor3f(mystery1 + invCompound, compound + invCompound, invCompound);
						break;
					case 2:
						glColor3f(invCompound, compound + invCompound, mystery1 + invCompound);
						break;
					case 3:
						glColor3f(invCompound, mystery1 + invCompound, compound + invCompound);
						break;
					case 4:
						glColor3f(mystery1 + invCompound, invCompound, compound + invCompound);
						break;
					case 5:
						glColor3f(compound + invCompound, invCompound, mystery1 + invCompound);
						break;
				}
			}
			glVertex2i(x - width / 2, y - height / 2);
		}
	}

	if (doMaxIncrease == true) {
		maxIterations += 10;
	}
	glEnd();
	glFlush();
}

void handleKeyPress(unsigned char key, int x, int y) {

}

void handleMouseClick(int button, int state, int x, int y) {
	scale = scale * 1.5;
}