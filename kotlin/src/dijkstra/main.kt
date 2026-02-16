package dijkstra

private val nodeIds = arrayOf('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i')

fun main() {
    /**
     * A fictional section of the street grid of Manhattan.
     * Avenues run east to west and are longer than streets, which run north to south.
     *
     * The numbers (weights) of the Dijkstra.graph represent traffic that makes that path slower.
     *
     *    a - 3 - b - 4 - c
     *    |       |       |
     *    1       2       1
     *    |       |       |
     *    d - 3 - e - 3 - f
     *    |               |
     *    2               3
     *    |               |
     *    g - 3 - h - 4 - i
     */

    val nodes = nodeIds.associateWith { Node(it) }

    fun edge(from: Char, to: Char, dist: Float) =
        Edge(nodes.getValue(from), nodes.getValue(to), Distance(dist))

    val edges = arrayOf(
        edge('a', 'b', 3f),
        edge('a', 'd', 1f),
        edge('b', 'c', 4f),
        edge('b', 'e', 2f),
        edge('c', 'f', 1f),
        edge('d', 'e', 3f),
        edge('d', 'g', 2f),
        edge('e', 'f', 3f),
        edge('f', 'i', 4f),
        edge('g', 'h', 3f),
        edge('h', 'i', 4f)
    )

    val graph = Graph(edges)
    val shortestPath = CalculateShortestPath(
        graph,
        nodes.getValue('a'),
        nodes.getValue('i')
    )

    println("Shortest path\n" + shortestPath.joinToString("->"))

//    println("Dijkstra.edges[0] ${edges[0]}")
}