// Name: [REDACTED]
// Date: May-17-2021
 
import java.util.*;
import java.io.*;

/* Resource classes and interfaces
 * for use with Graphs3: EdgeList,
 *              Graphs4: DFS-BFS
 *          and Graphs5: EdgeListCities
 */

/* Graphs 3: EdgeList 
 */
interface VertexInterface {
   String toString(); // Don't use commas in the list.  Example: "C [C D]"
   String getName();
   ArrayList<Vertex> getAdjacencies();
   void addAdjacent(Vertex v);
} 

class Vertex implements VertexInterface {
   private final String name;
   private ArrayList<Vertex> adjacencies;

   public Vertex(String name) {
      this.name = name;
      this.adjacencies = new ArrayList<Vertex>();
   }
  
  //interface time
  // "name [adj1 adj2 adj3]"
   public String toString() {
      String returnable = "";
      returnable += this.name;
      returnable += " [";
      for (Vertex adj : this.adjacencies) {
         returnable += adj.getName() + " ";
      }

      if (this.adjacencies.size() > 0) {
         returnable = returnable.substring(0, returnable.length() - 1);
      }
      returnable += "]";

      return returnable;
   }

   //hiss
   public String getName() {
      return this.name;
   }

   //nyn
   public ArrayList<Vertex> getAdjacencies() {
      return this.adjacencies;
   }

   public void addAdjacent(Vertex v) {
      this.adjacencies.add(v);
   }
}

interface AdjListInterface { 
   List<Vertex> getVertices();
   Vertex getVertex(int i) ;
   Vertex getVertex(String vertexName);
   Map<String, Integer> getVertexMap();
   void addVertex(String v);
   void addEdge(String source, String target);
   String toString();  //returns all vertices with their edges (omit commas)
}

  
/* Graphs 4: DFS and BFS 
 */
interface DFS_BFS {
   List<Vertex> depthFirstSearch(String name);
   List<Vertex> depthFirstSearch(Vertex v);
   List<Vertex> breadthFirstSearch(String name);
   List<Vertex> breadthFirstSearch(Vertex v);
   /*  three extra credit methods */
   List<Vertex> depthFirstRecur(String name);
   List<Vertex> depthFirstRecur(Vertex v);
   void depthFirstRecurHelper(Vertex v, ArrayList<Vertex> reachable);
}

/* Graphs 5: Edgelist with Cities 
 */
interface EdgeListWithCities {
   void graphFromEdgeListData(String fileName) throws FileNotFoundException;
   int edgeCount();
   int vertexCount(); //count the vertices in the object
   boolean isReachable(String source, String target);
   boolean isConnected();
}


public class AdjList implements AdjListInterface, DFS_BFS, EdgeListWithCities {
   private ArrayList<Vertex> vertices = new ArrayList<Vertex>();
   private Map<String, Integer> nameToIndex = new TreeMap<String, Integer>();

   public AdjList() {}

   //get get get
   public List<Vertex> getVertices() {
      return this.vertices;
   }

   public Vertex getVertex(int i) {
      return this.vertices.get(i);
   }

   public Vertex getVertex(String vertexName) {
      return this.vertices.get(this.nameToIndex.get(vertexName));
   }

   public Map<String, Integer> getVertexMap() {
      return this.nameToIndex;
   }



   //set set set
   public void addVertex(String v) {
      //don't add if already exists
      try {
         this.getVertex(v);
      } catch (Exception e) {
         //add to vertices
         this.vertices.add(new Vertex(v));

         //add to name list
         this.nameToIndex.put(v, this.vertices.size()-1);
      }
   }
   
   public void addEdge(String source, String target) {
      Vertex end;
      Vertex start;
      //make sure vertices exist before putting an adjacency between them
      try {
         start = this.getVertex(source);
      } catch (Exception e) {
         this.addVertex(source);
         start = this.getVertex(source);
      }

      try {
         end = this.getVertex(target);
      } catch (Exception e) {
         this.addVertex(target);
         end = this.getVertex(target);
      }
      this.getVertex(source).addAdjacent(end);
   }


   //giving up on organization entirely
   public void graphFromEdgeListData(String fileName) throws FileNotFoundException {
      //scanner for scanning.. things...
      Scanner radium = new Scanner(new File(fileName));

      //reset to defaults
      this.vertices = new ArrayList<Vertex>();
      this.nameToIndex = new TreeMap<String, Integer>();

      //append names one at a time
      while (radium.hasNext()) {
         String[] cityDestination = radium.nextLine().split(" ");
         this.addEdge(cityDestination[0], cityDestination[1]);
      }

      radium.close();
   }

   public int edgeCount() {
      int count = 0;
      //loop through all vertices
      for (Vertex v : this.vertices) {
         //append number of edges
         count += v.getAdjacencies().size();
      }
      return count;
   }

   //returns number of vertices in the graph
   public int vertexCount() {
      return this.vertices.size();
   }

   public boolean isReachable(String source, String target) {
      return (this.depthFirstSearch(source).indexOf(this.getVertex(target)) != -1);
   }

   //returns true if all vertices can be reached from any other vertex
   //question, is it all other vertices? Or just a random one? Because this thingy is directional. I've implemented an arbitrary vertex because that's easier to code.
   public boolean isConnected() {
      return (this.depthFirstSearch(this.getVertex(0)).size() == this.vertexCount());
   }

   //returns list seperated by newLine
   public String toString() {
      String theOneTheOnly = "";
      for (Vertex v : this.vertices) {
         theOneTheOnly += v.toString() + "\n";
      }
      return theOneTheOnly;
   }


   //depth search
   public List<Vertex> depthFirstSearch(String name) {
      return this.depthFirstSearch(this.getVertex(name));
   }

   public List<Vertex> depthFirstSearch(Vertex v) {
      //create final list + stack
      ArrayList<Vertex> finalList = new ArrayList<Vertex>();
      //you may think this variable name is because each vertex has a 'family' of adjacent vertexes, but it's really just an answer to the question "can you stack your family?"
      //the answer is yes.
      Stack<Vertex> family = new Stack<Vertex>();
      family.push(v);
      finalList.add(v);

      //loop until stack is empty
      while (!family.empty()) {
         //pop top of stack off
         Vertex currentVert = family.pop();
         
         //loop through vertex's edges
         for (Vertex j : currentVert.getAdjacencies()) {
            //if the edge isn't in the list, put it in the list and the stack
            if (!finalList.contains(j)) {
               finalList.add(j);
               family.push(j);
            }
         }
      }

      //qed or whatever
      return finalList;
   }






   //breadth search
   public List<Vertex> breadthFirstSearch(String name) {
      return this.breadthFirstSearch(this.getVertex(name));
   }

   public List<Vertex> breadthFirstSearch(Vertex v) {
      //like depth search, but with a queue instead of a stack. Fancy.

      ArrayList<Vertex> finalList = new ArrayList<Vertex>();
      LinkedList<Vertex> theQueue = new LinkedList<Vertex>();
      theQueue.add(v);
      finalList.add(v);

      while (theQueue.peek() != null) {
         Vertex currentVert = theQueue.remove();

         for (Vertex j : currentVert.getAdjacencies()) {
            if (!finalList.contains(j)) {
               finalList.add(j);
               theQueue.add(j);
            }
         }
      }
      return finalList;
   }


 /*  three extra credit methods, recursive version  */
   public List<Vertex> depthFirstRecur(String name) {
      return null;
   }
   
   public List<Vertex> depthFirstRecur(Vertex v) {
      return null;
   }
   
   public void depthFirstRecurHelper(Vertex v, ArrayList<Vertex> reachable) {
      return;
   }
}


