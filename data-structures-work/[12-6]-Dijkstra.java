// Name: [REDACTED]
// Date: May-24-2021
 
import java.util.*;
import java.io.*;

/* Resource classes and interfaces
 * for use with Graphs6: Dijkstra
 *              Graphs7: Dijkstra with Cities
 */

class Edge {
   public final wVertex target;
   public final double weight;
  
   public Edge(wVertex argTarget, double argWeight) {
      this.target = argTarget;
      this.weight = argWeight;
   }
}

interface wVertexInterface {
   String getName();
   double getMinDistance();
   void setMinDistance(double m);
   wVertex getPrevious();   //for Dijkstra 7
   void setPrevious(wVertex v);  //for Dijkstra 7
   ArrayList<Edge> getAdjacencies();
   void addEdge(wVertex v, double weight);
   int compareTo(wVertex other);
}

class wVertex implements Comparable<wVertex>, wVertexInterface {
   private final String name;
   private ArrayList<Edge> adjacencies = new ArrayList<Edge>();
   private double minDistance = Double.POSITIVE_INFINITY;
   private wVertex previous;  //for building the actual path in Dijkstra 7
   
   /*  enter your code for this class here   */ 
   public wVertex(String name) {
      this.name = name;
   }

   public String getName() {
      return this.name;
   }

   public double getMinDistance() {
      return this.minDistance;
   }

   public void setMinDistance(double m) {
      this.minDistance = m;
   }

   public wVertex getPrevious() {
      return this.previous;
   }

   public void setPrevious(wVertex v) {
      this.previous = v;
   }

   public ArrayList<Edge> getAdjacencies() {
      return this.adjacencies;
   }

   public void addEdge(wVertex v, double weight) {
      this.adjacencies.add(new Edge(v, weight));
   }

   public int compareTo(wVertex other) {
      return (int)(this.minDistance - other.getMinDistance());
   }
}

interface AdjListWeightedInterface {
   List<wVertex> getVertices();
   Map<String, Integer> getNameToIndex();
   wVertex getVertex(int i);   
   wVertex getVertex(String vertexName);
   void addVertex(String v);
   void addEdge(String source, String target, double weight);
   void minimumWeightPath(String vertexName);   //Dijkstra's
}

/* Interface for Graphs 7:  Dijkstra with Cities 
 */

interface AdjListWeightedInterfaceWithCities {
   List<String> getShortestPathTo(wVertex v);
   AdjListWeighted graphFromEdgeListData(File vertexNames, File edgeListData) throws FileNotFoundException ;
}
 

public class AdjListWeighted implements AdjListWeightedInterface, AdjListWeightedInterfaceWithCities {
   private List<wVertex> vertices = new ArrayList<wVertex>();
   private Map<String, Integer> nameToIndex = new HashMap<String, Integer>();
   private wVertex start = null;
   //the constructor is a no-arg constructor 
   public AdjListWeighted() {}

   public List<wVertex> getVertices() {
      return this.vertices;
   }

   public Map<String, Integer> getNameToIndex() {
      return this.nameToIndex;
   }

   public wVertex getVertex(int i) {
      return this.vertices.get(i);
   }

   public wVertex getVertex(String vertexName) {
      return this.vertices.get(this.nameToIndex.get(vertexName));
   }

   public void addVertex(String v) {
      this.vertices.add(new wVertex(v));
      this.nameToIndex.put(v, this.vertices.size()-1);
   }

   public void addEdge(String source, String target, double weight) {
      this.getVertex(source).addEdge(this.getVertex(target), weight);
   }

   //minimumWeightPath aka dijkstra's algorithm, my good old friend
   public void minimumWeightPath(String vertexName) {
      //set distances to max
      for (wVertex v : this.vertices) {
         v.setMinDistance(Double.POSITIVE_INFINITY);
      }

      //create list of unvisited nodes
      List<wVertex> unvisited = new ArrayList<wVertex>();
      for (wVertex v : this.vertices) {
         unvisited.add(v);
      }

      this.start = this.getVertex(vertexName);
      this.start.setMinDistance(0);

      //loop until all have been visited
      while (unvisited.size() > 0) {
         //select closest unvisited node
         wVertex selected = null;
         for (wVertex v : unvisited) {
            if (selected == null) {
               if (v.getMinDistance() != Double.POSITIVE_INFINITY) {
                  selected = v;
               }
            } else if (selected.compareTo(v) > 0) {
               selected = v;
            }
         }

         //if there are unreachable nodes, breakout early
         if (selected == null) {
            return;
         }

         //mark as visited
         unvisited.remove(selected);

         //get distance to closest node's neighbors, update in node value
         for (Edge e : selected.getAdjacencies()) {
            if (e.weight + selected.getMinDistance() < e.target.getMinDistance()) {
               e.target.setMinDistance(e.weight + selected.getMinDistance());
               e.target.setPrevious(selected);
            }
         }
      }
   }

   public List<String> getShortestPathTo(wVertex v) {
      List<String> toReturn = new ArrayList<String>();
      //start from vertex, trace backwards to start
      while (v != null) {
         toReturn.add(0, v.getName());
         v = v.getPrevious();
      }
      return toReturn;
   }

   public AdjListWeighted graphFromEdgeListData(File vertexNames, File edgeListData) throws FileNotFoundException {
      //they told me to write more professional comments. I just want to go home, I don't want to be here. The world is structured backwards to how it should be and I just have to go along with it. It's very important that you know Communism is bad.
      //this is not funny. Nobody finds it funny.
      Scanner beryllium = new Scanner(vertexNames);
      Scanner uranium = new Scanner(edgeListData);

      //reset to defaults
      this.vertices = new ArrayList<wVertex>();
      this.nameToIndex = new HashMap<String, Integer>();
      this.start = null;

      //you didn't need to tell me that there were 8 cities but that's cool I guess
      beryllium.nextLine();

      //append names
      while (beryllium.hasNext()) {
         this.addVertex(beryllium.nextLine());
      }
      beryllium.close();

      //vertices
      while (uranium.hasNext()) {
         String[] kryptonBarium = uranium.nextLine().split(" ");
         this.addEdge(kryptonBarium[0], kryptonBarium[1], Double.parseDouble(kryptonBarium[2]));
      }
      uranium.close();
      return this;
   }
}


