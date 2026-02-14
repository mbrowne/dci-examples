package dijkstra

@JvmInline
value class Distance(val distance: Float): Comparable<Distance> {
    init {
        require(distance >= 0)
    }

    override fun compareTo(other: Distance): Int {
        return distance.compareTo(other.distance)
    }

    operator fun plus(other: Distance): Distance {
        return Distance(distance + other.distance)
    }
}

data class Node<TId>(
    override val id: TId
): NodeRolePlayer<TId> {}

data class Edge<TNodeId>(
    val from: Node<TNodeId>,
    val to: Node<TNodeId>,
    val distance: Distance
)

class Graph<TNodeId>(): GraphRolePlayer<TNodeId> {
    private val paths = hashMapOf<Node<TNodeId>, HashMap<Node<TNodeId>, Distance>>()

    override val nodes: Set<Node<TNodeId>>
        get() = paths.keys

//    constructor(Dijkstra.edges: Array<Dijkstra.Edge>) : this(
//        Dijkstra.edges.groupBy({ it.from }, { it.to to it.distance })
//            .mapValues { (_, edgeDetails) -> edgeDetails.toMap() }
//    )
    constructor(edges: Array<Edge<TNodeId>>) : this() {
        for (edge in edges) {
            // ensure path map is created
            val pathsFrom = paths.getOrPut(edge.from) { HashMap() }
            pathsFrom[edge.to] = edge.distance
            paths.getOrPut(edge.to) { HashMap() }
        }
    }

    override fun pathsFrom(n: Node<TNodeId>): HashMap<Node<TNodeId>, Distance> = paths[n] ?: HashMap()

    override fun contains(n: Node<TNodeId>): Boolean = paths.containsKey(n)

    override fun distanceBetween(x: Node<TNodeId>, y: Node<TNodeId>): Distance? {
        val neighbors = paths[x]
        requireNotNull(neighbors, { "Neighbor $x not found in graph" })
        // note: this might return null, and will always be null for any edges
        // not explicitly defined (we don't create bidirectional edges automatically)
        return neighbors[y]
    }
}

