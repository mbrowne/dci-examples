package dijkstra

@JvmInline
value class Distance(val value: Float) : Comparable<Distance> {
    init { require(value >= 0) }
    override fun compareTo(other: Distance) = value.compareTo(other.value)
    operator fun plus(other: Distance) = Distance(value + other.value)

    companion object {
        val Infinity = Distance(Float.POSITIVE_INFINITY)
    }
}

data class Node<out TId>(val id: TId) {
    override fun toString() = id.toString()
}

data class Edge<TNodeId>(val from: Node<TNodeId>, val to: Node<TNodeId>, val distance: Distance)

class Graph<TNodeId> : GraphRolePlayer<TNodeId> {
    private val paths = mutableMapOf<Node<TNodeId>, MutableMap<Node<TNodeId>, Distance>>()

    override val nodes: Set<Node<TNodeId>> get() = paths.keys

    constructor(edges: Array<Edge<TNodeId>>) {
        for (edge in edges) {
            // ensure path map is created
            val pathsFrom = paths.getOrPut(edge.from) { mutableMapOf() }
            pathsFrom[edge.to] = edge.distance
            paths.getOrPut(edge.to) { mutableMapOf() }
        }
    }

    override fun pathsFrom(n: Node<TNodeId>) = paths[n]
    override fun contains(n: Node<TNodeId>) = paths.containsKey(n)
    override fun distanceBetween(x: Node<TNodeId>, y: Node<TNodeId>) = paths[x]?.get(y)
}

//@JvmInline
//value class Distance(val distance: Float): Comparable<Distance> {
//    init { require(distance >= 0) }
//    override fun compareTo(other: Distance): Int = distance.compareTo(other.distance)
//    operator fun plus(other: Distance): Distance = Distance(distance + other.distance)
//
//    companion object {
//        val Infinity = Distance(Float.POSITIVE_INFINITY)
//    }
//}
//
//data class Node<TId>(
//    override val id: TId
//): NodeRolePlayer<TId> {
//    override fun toString() = id.toString()
//}
//
//data class Edge<TNodeId>(
//    val from: Node<TNodeId>,
//    val to: Node<TNodeId>,
//    val distance: Distance
//)
//
//class Graph<TNodeId>(): GraphRolePlayer<TNodeId> {
//    private val paths = hashMapOf<Node<TNodeId>, HashMap<Node<TNodeId>, Distance>>()
//
//    override val nodes: Set<Node<TNodeId>>
//        get() = paths.keys
//
////    constructor(Dijkstra.edges: Array<Dijkstra.Edge>) : this(
////        Dijkstra.edges.groupBy({ it.from }, { it.to to it.distance })
////            .mapValues { (_, edgeDetails) -> edgeDetails.toMap() }
////    )
//    constructor(edges: Array<Edge<TNodeId>>) : this() {
//        for (edge in edges) {
//            // ensure path map is created
//            val pathsFrom = paths.getOrPut(edge.from) { HashMap() }
//            pathsFrom[edge.to] = edge.distance
//            paths.getOrPut(edge.to) { HashMap() }
//        }
//    }
//
//    override fun pathsFrom(n: Node<TNodeId>): HashMap<Node<TNodeId>, Distance> = paths[n] ?: HashMap()
//
//    override fun contains(n: Node<TNodeId>): Boolean = paths.containsKey(n)
//
//    override fun distanceBetween(x: Node<TNodeId>, y: Node<TNodeId>): Distance? {
//        val neighbors = paths[x]
//        requireNotNull(neighbors, { "Neighbor $x not found in graph" })
//        // note: this might return null, and will always be null for any edges
//        // not explicitly defined (we don't create bidirectional edges automatically)
//        return neighbors[y]
//    }
//}
//
