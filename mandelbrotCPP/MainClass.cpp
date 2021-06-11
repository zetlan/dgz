#pragma once
#include "MainClass.h"

MainClass::MainClass() {
	_window = nullptr;
}

MainClass::~MainClass() {

}

void MainClass::run() {
	setup();
}

void MainClass::setup() {
	//who is SDL and why do they have everything
	SDL_Init(SDL_INIT_EVERYTHING);

	_window = SDL_CreateWindow("the dark", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 640, 480, SDL_WINDOW_OPENGL);
}