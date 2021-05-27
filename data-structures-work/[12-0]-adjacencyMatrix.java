// Name: [REDACTED]
// Date: May-10-2021
 
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
   public List<String> getReachables(String from);  //Warshall extension
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





public class AdjMat implements AdjacencyMatrix, Warshall, Floyd {
   private int[][] grid = null;
   //maps name to index
   private Map<String, Integer> vertices = null;
   //list of names (can map index to name)
   ArrayList<String> nameList = null;
   //the cost at which going to a different node is impossible
   private int stopCost = 9999;

   public AdjMat(int size) {
      this.grid = new int[size][size];
      //populate grid with 0s
      for (int column=0; column<this.grid.length; column++) {
         for (int row=0; row<this.grid[column].length; row++) {
            this.grid[column][row] = this.stopCost;
         }
      }
   }

   //utility functions
   //warsaw
   public void allPairsReachability() {
      //loop through all cities
      for (int mid=0; mid<this.grid.length; mid++) {
         //loop through all cities
         for (int from=0; from<this.grid.length; from++) {
            if (this.grid[from][mid] > 0) {
               //if they can connect, loop through all cities that the mid is going to
               for (int to=0; to<this.grid.length; to++) {
                  //append the going-to cities to the from city
                  if (this.grid[mid][to] > 0) {
                     this.grid[from][to] = 1;
                  }
               }
            }
         }
      }
   }

   //pink
   public void allPairsWeighted() {
      //see above
      //instead of appending a simple 0 or 1, append if the cost is low enough
      for (int mid=0; mid<this.grid.length; mid++) {
         for (int from=0; from<this.grid.length; from++) {
            if (this.grid[from][mid] < this.stopCost) {
               for (int to=0; to<this.grid.length; to++) {
                  if (this.grid[mid][to] < this.stopCost) {
                     //add costs together, cost can never go up
                     if (this.grid[from][to] > this.grid[from][mid] + this.grid[mid][to]) {
                        this.grid[from][to] = this.grid[from][mid] + this.grid[mid][to];
                     }
                  }
               }
            }
         }
      }
   }


   //getters
   //returns the number of edges in the graph
   public int edgeCount() {
      int numEdges = 0;
      for (int a=0; a<this.grid.length; a++) {
         for (int b=0; b<this.grid[a].length; b++) {
            //stopCost represents no edge, 0 cost means links to self and doesn't count
            if (this.grid[a][b] < this.stopCost && this.grid[a][b] != 0) {
               numEdges += 1;
            }
         }
      }
      return numEdges;
   }

   public void displayVertices() {
      for (String cityName : this.vertices.keySet()) {
         System.out.println(this.vertices.get(cityName) + "-" + cityName);
      }
   }

   //these only work with weighted graphs
   public int getCost(int from, int to) {
      return this.grid[from][to];
   }

   public int getCost(String from, String to) {
      if (this.vertices == null) {
         return this.stopCost;
      }
      return this.grid[this.vertices.get(from)][this.vertices.get(to)];
   }

   public List<Integer> getNeighbors(int source) {
      //loop through the source line and add all neighbors to the list
      ArrayList<Integer> toReturn = new ArrayList<Integer>();
      for (int v=0; v<this.grid[source].length; v++) {
         if (this.grid[source][v] < this.stopCost) {
            //if there's a neighbor, add to the list
            toReturn.add(v);
         }
      }

      return toReturn;
   }

   public List<String> getReachables(String city) {
      List<String> reachCities = new ArrayList<String>();
      int cityIndex = this.vertices.get(city);
      for (int u=0; u<this.grid.length; u++) {
         if (this.grid[cityIndex][u] < this.stopCost) {
            reachCities.add(this.nameList.get(u));
         }
      }
      return reachCities; 
   }

   public Map<String, Integer> getVertices() {
      return this.vertices;
   }

   public boolean isEdge(int node, int neighbor) {
      return (this.grid[node][neighbor] < this.stopCost);
   }

   public boolean isEdge(String cityName, String neighborName) {
      if (this.vertices == null) {
         return false;
      }
      return (this.grid[this.vertices.get(cityName)][this.vertices.get(neighborName)] < this.stopCost);
   }

   public String toString() {
      String finalStr = "";
      //loop loop
      for (int a=0; a<this.grid.length; a++) {
         for (int b=0; b<this.grid[a].length; b++) {
            //spacing correctly. 9999 is the max, so they're all capped at 5 spaces
            if (this.grid[a][b] < 1000) {
               finalStr += " ";
            }
            if (this.grid[a][b] < 100) {
               finalStr += " ";
            }
            if (this.grid[a][b] < 10) {
               finalStr += " ";
            }
            finalStr += "  " + this.grid[a][b];
         }
         finalStr += "\n";
      }
      return finalStr;
   }





   //setters
   //these do not work with weighted graphs
   public void toggleEdge(int node, int neighborToToggle) {
      this.grid[node][neighborToToggle] = (this.grid[node][neighborToToggle] + 1) % 2;
   }

   public void addEdge(int node, int neighbor) {
      this.grid[node][neighbor] = 1;
   }

   public void removeEdge(int node, int neighbor) {
      this.grid[node][neighbor] = 0;
   }




   //file reading
   public void readGrid(String fileName) throws FileNotFoundException {
      Scanner fileViewer = new Scanner(new File(fileName));

      //first index is size
      int num = Integer.parseInt(fileViewer.nextLine());
      this.grid = new int[num][num];
      for (int n=0; n<num; n++) {
         String line = fileViewer.nextLine();
         String[] vals = line.split(" ");
         for (int r=0; r<num; r++) {
            this.grid[n][r] = Integer.parseInt(vals[r]);
         }
      }
   }

   public void readNames(String fileName) throws FileNotFoundException {
      Scanner fileViewer = new Scanner(new File(fileName));

      //first index is the number of cities
      int num = Integer.parseInt(fileViewer.nextLine());
      this.vertices = new HashMap<String, Integer>();
      this.nameList = new ArrayList<String>();
      //put city names into mapping
      for (int n=0; n<num; n++) {
         String cityName = fileViewer.nextLine();
         this.vertices.put(cityName, n);
         //also create inverse
         this.nameList.add(cityName);
      }
      fileViewer.close();
   }
}
