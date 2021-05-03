// Name: [REDACTED]
// Date: May-2-2021
 
import java.util.*;
import java.io.*;

/* Resource classes and interfaces
 * for use with Graph0 AdjMat_0_Driver,
 *              Graph1 WarshallDriver,
 *          and Graph2 FloydDriver
 */

interface AdjacencyMatrix
{
   void addEdge(int source, int target);
   void removeEdge(int source, int target);
   boolean isEdge(int from, int to);
   String toString();   //returns the grid as a String
   int edgeCount();
   List<Integer> getNeighbors(int source);
   //public List<String> getReachables(String from);  //Warshall extension
}

interface Warshall      //User-friendly functionality
{
   boolean isEdge(String from, String to);
   Map<String, Integer> getVertices();     
   void readNames(String fileName) throws FileNotFoundException;
   void readGrid(String fileName) throws FileNotFoundException;
   void displayVertices();
   void allPairsReachability();  // Warshall's Algorithm
}

interface Floyd
{
   int getCost(int from, int to);
   int getCost(String from, String to);
   void allPairsWeighted(); 
}

public class AdjMat implements AdjacencyMatrix//,Warshall//,Floyd 
{
   private int[][] grid = null;   //adjacency matrix representation
   private Map<String, Integer> vertices = null;   // name maps to index (for Warshall & Floyd)
   /*for Warshall's Extension*/  ArrayList<String> nameList = null;  //reverses the map, index-->name
	  
   /*  enter your code here  */  
   public AdjMat(int size) {
      this.grid = new int[size][size];
      //populate grid with 0s
      for (int column=0; column<this.grid.length; column++) {
         for (int row=0; row<this.grid[column].length; row++) {
            this.grid[column][row] = 0;
         }
      }
   }

   //toggles an edge on/off in the graph
   public void toggleEdge(int node, int neighborToToggle) {
      this.grid[node][neighborToToggle] = (this.grid[node][neighborToToggle] + 1) % 2;
   }

   //returns the number of edges in the graph
   public int edgeCount() {
      int numEdges = 0;
      for (int a=0; a<this.grid.length; a++) {
         for (int b=0; b<this.grid[a].length; b++) {
            //0 represents no edge, and the only other option is 1, so I can get away with this
            numEdges += this.grid[a][b];
         }
      }
      return numEdges;
   }

   //my soul weeps
   public void addEdge(int node, int neighbor) {
      this.grid[node][neighbor] = 1;
   }

   public void removeEdge(int node, int neighbor) {
      this.grid[node][neighbor] = 0;
   }

   public boolean isEdge(int node, int neighbor) {
      return (this.grid[node][neighbor] == 1);
   }

   public List<Integer> getNeighbors(int source) {
      //loop through the source line and add all neighbors to the list
      ArrayList<Integer> toReturn = new ArrayList<Integer>();
      for (int v=0; v<this.grid[source].length; v++) {
         if (this.grid[source][v] == 1) {
            //if there's a neighbor, add to the list
            toReturn.add(v);
         }
      }

      return toReturn;
   }


   public String toString() {
      String finalStr = "";
      //loop loop
      for (int a=0; a<this.grid.length; a++) {
         for (int b=0; b<this.grid[a].length; b++) {
            finalStr += " " + this.grid[a][b];
         }
         finalStr += "\n";
      }
      return finalStr;
   }
}
