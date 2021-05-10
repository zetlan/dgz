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





public class AdjMat implements AdjacencyMatrix, Warshall//,Floyd 
{
   private int[][] grid = null;
   private Map<String, Integer> vertices = null;   // name maps to index (for Warshall & Floyd)
   ArrayList<String> nameList = null;  //reverses the map, index-->name

   public AdjMat(int size) {
      this.grid = new int[size][size];
      //populate grid with 0s
      for (int column=0; column<this.grid.length; column++) {
         for (int row=0; row<this.grid[column].length; row++) {
            this.grid[column][row] = 0;
         }
      }
   }

   //utility functions
   //this is n^3, gotta throw the whole function away
   //just kidding, don't do that, this is Warshall's algorithm
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


   //getters
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

   public void displayVertices() {
      for (String cityName : this.vertices.keySet()) {
         System.out.println(this.vertices.get(cityName) + "-" + cityName);
      }
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

   public List<String> getReachables(String city) {
      List<String> reachCities = new ArrayList<String>();
      int cityIndex = this.vertices.get(city);
      for (int u=0; u<this.grid.length; u++) {
         if (this.grid[cityIndex][u] > 0) {
            reachCities.add(this.nameList.get(u));
         }
      }
      return reachCities; 
   }

   public Map<String, Integer> getVertices() {
      return this.vertices;
   }

   public boolean isEdge(int node, int neighbor) {
      return (this.grid[node][neighbor] == 1);
   }

   public boolean isEdge(String cityName, String neighborName) {
      if (this.vertices == null) {
         return false;
      }
      return (this.grid[this.vertices.get(cityName)][this.vertices.get(neighborName)] == 1);
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





   //setters
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
         //System.out.println("zero is zero: " + ("0" == "0"));
         for (int r=0; r<num; r++) {
            /*I hate java so much. Why doesn't == work here? That was rhetorical, I don't care, it's stupid either way. 
            I read a String "0" from the file, I compare it to a String "0", strings work with ==, but I can't compare the read value to the "0" with ==. this is a stupid language 
            
            I am not insulting the teachers or the course curriculum. However, this syntactical choice utterly confounds me, and the amount of frustration I experience from not being able to go 
            == or array[0] or .push on everything, and having to instead always go .equals and .add and .get or .push or .set, it's so many functions for tons of slightly different syntax goodness gracious,
            it makes me want to scream. I used to think there was a god but then I saw java, and I realized that at the very least if there is a god it is a vengeful one.*/
            if (vals[r].equals("0")) {
               this.grid[n][r] = 0;
            } else {
               this.grid[n][r] = 1;
            }
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
