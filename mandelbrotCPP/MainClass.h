//I have no idea what any of this is
#pragma once
#include <SDL/SDL.h>
#include <GL/gl.h>

class MainClass {
	public:
		MainClass();
		~MainClass();
		void run();
		void setup();

	private: 
		SDL_Window* _window;
};

