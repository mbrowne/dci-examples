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
    private val paths: Map<Node<TNodeId>, Map<Node<TNodeId>, Distance>>
    override val nodes: Set<Node<TNodeId>> get() = paths.keys

//    private val paths = edges.groupBy { it.from }.let { grouped ->
//        edges.flatMap { listOf(it.from, it.to) }.distinct()
//            .associateWith {
//                grouped[it]?.associate {
//                    // ensure path map is created
//                    edge -> edge.to to edge.distance } ?: emptyMap()
//                }
//    }

    constructor(edges: Array<Edge<TNodeId>>) {
        val pathMaps = mutableMapOf<Node<TNodeId>, MutableMap<Node<TNodeId>, Distance>>()
        for (edge in edges) {
            // ensure path map is created
            val pathsFrom = pathMaps.getOrPut(edge.from) { mutableMapOf() }
            pathsFrom[edge.to] = edge.distance
            pathMaps.getOrPut(edge.to) { mutableMapOf() }
        }
        paths = pathMaps
    }

//    constructor(edges: Array<Edge<TNodeId>>) {
//        val grouped = edges.groupBy({ it.from }, { it.to to it.distance })
//        paths = edges.flatMap { listOf(it.from, it.to) }
//            .distinct()
//            .associateWith { node ->
//                grouped[node]?.toMap() ?: emptyMap()
//            }
//    }

    override fun pathsFrom(n: Node<TNodeId>) = paths[n]
    override fun contains(n: Node<TNodeId>) = paths.containsKey(n)
    override fun distanceBetween(x: Node<TNodeId>, y: Node<TNodeId>) = paths[x]?.get(y)
}
