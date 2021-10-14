# By Tarushii Goel, 1st period

import tkinter as tk
import time

lines = [] #list of all the lines created

def create_grid(c):
	#create all horizontal lines
	for i in range(0, 800, 8):
		for j in range(0, 800, 8):
			line = c.create_line([(i, j), (i+8, j)], tag='grid_line')
			lines.append(line)


	# Creates all vertical lines
	for i in range(0, 800, 8):
		for j in range(0, 800, 8):
			line = c.create_line([(j, i), (j, i+8)], tag='grid_line')
			lines.append(line)

def make_red(r, c): #makes all the lines red
	for line in lines:
		c.itemconfig(line, fill="red") #changes color of one line to red
		r.update() #update frame
		#time.sleep(0.1)

root = tk.Tk() #creates the frame

canvas = tk.Canvas(root, height=800, width=800, bg='white') #creates a canvas widget, which can be used for drawing lines and shapes
create_grid(canvas)
canvas.pack(expand=True) #packing widgets places them on the board

make_red(root, canvas)

#root.mainloop()
