import java.util.*;

public class KnightTour {
   /*boardsTarget: the number of boards to output before stopping.
   A warning, many of the boards are extremely similar.
   
   size: the board size
   
   initialPos: the starting position of the knight in column, row notation
   
   other thoughts:
   
   arrays use curly brackets instead of square. Why?
   
   sorting the child knights by number of neighbors drastically reduces the
   time taken to complete searching. Interesting.
   
   I used bubblesort instead of quicksort because I didn't want to deal with arrays vs arrayLists.*/
   
   public static int[] size = {8, 8};
   public static int[] initialPos = {0, 0};
   public static int boardsTarget = 1;
   public static int boardsDone = 0;
   
   public static long iterations = 0;
   
   public static void main(String[] args) {
      //define initial state of the board to be all 0s
      int initialBoard[][] = new int[size[0]][size[1]];
      
      for (int a=0;a<initialBoard.length;a++) {
         for (int b=0;b<initialBoard[a].length;b++) {
            initialBoard[a][b] = 0;
         }
      }
      
      //making sure position is in bounds
      if (initialPos[0] >= 0 && initialPos[0] < size[0] && initialPos[1] >= 0 && initialPos[1] < size[1]) {
         //calling the initial solve function on the first layer                      
         layerBoard(initialBoard, initialPos, 1);
         System.out.println("search completed");
      } else {
         System.out.println("invalid position recieved, please change initialPos");
      }
   }
   
   public static void layerBoard(int[][] boardNow, int[] pos, int layer) {
   
      //iteration tracker, just so the program can tell you when it's doing a lot of
      iterations += 1;
      if (iterations % 100000 == 0) {
         System.out.println("iterations completed: " + (iterations / 1000000.00) + " million");
      }
      //create local copy of boardNow to avoid strange pointer behavior
      int[][] myBoardNow = duplicateArray(boardNow);
      
      //place self
      myBoardNow[pos[0]][pos[1]] = layer;
      
      if (boardsDone < boardsTarget) {
         //if all the squares are filled up, print the board
         if (findEmpty(myBoardNow) == false) {
            output2dArray(myBoardNow);
         } else {
            //if not, recurse to the next layer
            //where children will go and their positions
            
            int[][] myChildren = {{pos[0] - 2, pos[1] - 1, getNeighbors(myBoardNow, pos[0] - 2, pos[1] - 1)}, 
                                     {pos[0] - 2, pos[1] + 1, getNeighbors(myBoardNow, pos[0] - 2, pos[1] + 1)}, 
                                     {pos[0] - 1, pos[1] - 2, getNeighbors(myBoardNow, pos[0] - 1, pos[1] - 2)},
                                     {pos[0] + 1, pos[1] - 2, getNeighbors(myBoardNow, pos[0] + 1, pos[1] - 2)}, 
                                     {pos[0] + 2, pos[1] - 1, getNeighbors(myBoardNow, pos[0] + 2, pos[1] - 1)}, 
                                     {pos[0] + 2, pos[1] + 1, getNeighbors(myBoardNow, pos[0] + 2, pos[1] + 1)},    
                                     {pos[0] - 1, pos[1] + 2, getNeighbors(myBoardNow, pos[0] - 1, pos[1] + 2)},
                                     {pos[0] + 1, pos[1] + 2, getNeighbors(myBoardNow, pos[0] + 1, pos[1] + 2)}};
                                     
                                     
            
            
            //bubble sorting children from least neighbors to greatest neighbors
            for (int b=0;b<myChildren.length;b++) {
               for (int c=0;c<myChildren.length-(b+1);c++) {
                  //if the current value is greater than the value afterwards, swap them
                  if (myChildren[c][2] > myChildren[c+1][2]) {
                     int[] tomp = myChildren[c+1];
                     myChildren[c+1] = myChildren[c];
                     myChildren[c] = tomp;
                  }
               }
            }
                                  
            //actually calling child function with least neighbors first
            for (int v=0;v<myChildren.length;v++) {
               //only call child if position is free
               try {
                  if (myBoardNow[myChildren[v][0]][myChildren[v][1]] == 0) {
                     layerBoard(myBoardNow, myChildren[v], layer + 1);
                  }  
               } catch (Exception e) {}
            }
         }
      }   
   }
   
   public static void output2dArray(int[][] soup) {
      String asdf = " ";
      for (int p=0;p<size[1];p++) {
         asdf += "____";
      } 
      asdf += "\n [";
      for (int a=0;a<soup.length;a++) {
         for (int b=0;b<soup[a].length;b++) {
            //formatting
            if (soup[a][b] < 10) {
               asdf += "0";
            }
            //adding number
            asdf += soup[a][b];
            
            //cases for regular and end of line
            if (b < soup[a].length - 1) {
               asdf += "  ";
            } else {
               asdf += "]";
            }
         }
         
         //cases for regular and end of board
         if (a < soup.length - 1) {
            asdf += "\n\n ["; 
         } else {
            asdf += "\n ";
            for (int p=0;p<size[1];p++) {
               asdf += "‾‾‾‾";
            } 
         }
      }
      
      System.out.println(asdf);
      boardsDone += 1;
   }
   
   public static boolean findEmpty(int[][] soup) {
      boolean found = false;
      //for loops for width and heighdth
      for (int a=0;a<soup.length;a++) {
         for (int b=0;b<soup[a].length;b++) { 
            //if square is a 0, set found to true and break out
            if (soup[a][b] == 0) {
               found = true;
               break;
            }
         }
         
         //extra break check
         if (found == true) {
            break;
         }
      }
      return found;
   }
   
   public static int getNeighbors(int[][] soup, int posX, int posY) {
      //starting number of neighbors as 0
      int neighbors = 0;
      int[][] nPoses = {{posX - 2, posY - 1}, 
                         {posX - 2, posY + 1}, 
                         {posX - 1, posY - 2},
                         {posX + 1, posY - 2}, 
                         {posX + 2, posY - 1}, 
                         {posX + 2, posY + 1},    
                         {posX - 1, posY + 2},
                         {posX + 1, posY + 2}};
                                  
      //checking neighbor count
      for (int v=0;v<nPoses.length;v++) {
         //if the neighbor square is a 0, add 1
         try {
            if (soup[nPoses[v][0]][nPoses[v][1]] == 0) {
               neighbors += 1;
            }
         } catch (Exception e) {}
      }
      
      return neighbors;
   }
   
   public static int[][] duplicateArray(int[][] soup) {
      //duplicates an array while avoiding the garbage that is same-location pointers
      int newSoup[][] = new int[size[0]][size[1]];
      
      for (int a=0;a<newSoup.length;a++) {
         for (int b=0;b<newSoup[a].length;b++) {
            newSoup[a][b] = soup[a][b];
         }
      }
      return newSoup;
   }
}