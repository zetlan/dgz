class Graph(object):
    def __init__(self, graph_dict=None):
        """ initializes a graph object 
            If no dictionary or None is given, 
            an empty dictionary will be used
        """
        self.graph = {}
        if graph_dict is not None:
            self.graph = graph_dict

    def edges(self, vertice):
        """ returns a list of all the edges of a vertice"""
        edgeList = []
        for link in self.graph[vertice]:
            edgeList.append([vertice, link])
        return edgeList
        
    def all_vertices(self):
        """ returns the vertices of a graph as a set """
        vertSet = set()
        for node in self.graph:
            set.add(node)
        return vertSet



    def all_edges(self):
        """ returns the edges of a graph """
        #TODO

    def add_vertex(self, vertex):
        """ If the vertex "vertex" is not in 
            self._graph_dict, a key "vertex" with an empty
            list as a value is added to the dictionary. 
            Otherwise nothing has to be done. 
        """
        #TODO

    def add_edge(self, edge):
        """ assumes that edge is of type set, tuple or list; 
            between two vertices can be multiple edges! 
        """
        #TODO

    def generate_edges(self):
        """ A static method generating the edges of the 
            graph "graph". Edges are represented as sets 
            with one (a loop back to the vertex) or two 
            vertices 
        """
        #TODO
    
    def __iter__(self):
        self._iter_obj = iter(self._graph_dict)
        return self._iter_obj
    
    def __next__(self):
        """ allows us to iterate over the vertices """
        return next(self._iter_obj)

    def __str__(self):
        res = "vertices: "
        for k in self._graph_dict:
            res += str(k) + " "
        res += "\nedges: "
        for edge in self.generate_edges():
            res += str(edge) + " "
        return res


#testing
graph = Graph(g)

for vertice in graph:
    print(f"Edges of vertex {vertice}: ", graph.edges(vertice))
 
#Edges of vertex a:  {'d'}
#Edges of vertex b:  {'c'}
#Edges of vertex c:  {'c', 'd', 'b', 'e'}
#Edges of vertex d:  {'c', 'a'}
#Edges of vertex e:  {'c'}
#Edges of vertex f:  {}

graph.add_edge({"ab", "fg"})
graph.add_edge({"xyz", "bla"})
 
print("")
print("Vertices of graph:")
print(graph.all_vertices())

print("Edges of graph:")
print(graph.all_edges())