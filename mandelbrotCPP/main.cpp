#include <iostream>
#include "MainClass.h"
//using namespace std;
using std::cout;
using std::cin;
using std::string;


//int main(int argc, const char * argv[]) { ???

int main(int argc, char** argv) {
	MainClass cabinet;
	cabinet.run();

	cout << "press key to quit";
	int a;
	cin >> a;
	return 0;
}


/*
int main() {
	cout << "enter a number \n\n";
	
	int storage;
	string esc = "You see the image of the smiling sun overhead, its reflection scattered among the plexiglass buildings\nwritten on one of t";
	cin >> storage;
	cout << storage << " is your number. Keep it. I do not want it. I have too many already.\n";
	//String temp = std::in;
	return storage;
}
*/