package dijkstra

/*
  Algorithm
  (see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm for more details)

  Let us choose a starting node, and let the distance of node N be the distance from the
  starting node to N. Dijkstra's algorithm will initially start with infinite distances
  and will try to improve them step by step.

    1. Mark all nodes as unvisited. Create a set of all the unvisited nodes.

    2. Assign to every node a tentative distance from start value: for the starting node,
    it is zero, and for all other nodes, it is infinity. Set the starting node as the
    current node.

    3. For the current node, consider all of its unvisited neighbors and update their
    distances through the current node; compare the newly calculated distance to the one
    currently assigned to the neighbor and assign it the smaller one. For example, if the
    current node A is marked with a distance of 6, and the edge connecting it with its
    neighbor B has length 2, then the distance to B through A is 6 + 2 = 8. If B was
    previously marked with a distance greater than 8, then update it to 8 (the path to B
    through A is shorter). Otherwise, keep its current distance (the path to B through A
    is not the shortest).

    4. When we are done considering all of the unvisited neighbors of the current node,
    mark the current node as visited and remove it from the unvisited set. A visited node
    is never checked again.

    5. If the unvisited set is empty, or contains only nodes with infinite distance
    (which are unreachable), then stop - the algorithm is finished. In this
    implementation we are only concerned about the path to the destination node, so we
    also terminate here if the current node is the destination node.

    6. Select the unvisited node that is marked with the smallest tentative distance, and
    set it as the new current node, then go back to step 3.

  Once the loop exits (steps 3–5), we will know the shortest distance from the starting
  node to every visited node.
 */

interface GraphRolePlayer<TNodeId> {
    fun pathsFrom(n: Node<TNodeId>): HashMap<Node<TNodeId>, Distance>?
    fun contains(n: Node<TNodeId>): Boolean
    fun distanceBetween(x: Node<TNodeId>, y: Node<TNodeId>): Distance?
    val nodes: Set<Node<TNodeId>>
}

interface NodeRolePlayer<out T> {
    val id: T
}

typealias NodeRolePlayerAny = NodeRolePlayer<Any>
typealias TentativeDistancesRolePlayer = MutableMap<NodeRolePlayerAny, Distance>

fun <TNodeId: Any>CalculateShortestPath(Graph: GraphRolePlayer<TNodeId>, StartNode: NodeRolePlayerAny, DestinationNode: NodeRolePlayerAny) {
    if (!Graph.contains(StartNode as Node<TNodeId>) || !Graph.contains(DestinationNode as Node<TNodeId>)) {
        throw IllegalArgumentException("Nodes must be in the graph")
    }

    val UnvisitedNodes = Graph.nodes.toMutableSet()
    val ShortestPathSegments = HashMap<NodeRolePlayerAny, NodeRolePlayerAny>()
    val CurrentNode = StartNode

    val TentativeDistances: TentativeDistancesRolePlayer = mutableMapOf<NodeRolePlayerAny, Distance>(
        StartNode to Distance(0f)
    )

    class GraphRole {
        // fun GraphRolePlayer.distanceBetween(from: Node, to: Node): Distance = this.distanceBetween(from, to)
        fun GraphRolePlayer<TNodeId>.distanceBetweenNodes(from: NodeRolePlayer<TNodeId>, to: NodeRolePlayer<TNodeId>): Distance? =
            distanceBetween(from as Node<TNodeId>, to as Node<TNodeId>)

        fun GraphRolePlayer<TNodeId>.neighborsOf(n: NodeRolePlayer<TNodeId>): Set<NodeRolePlayer<TNodeId>> {
            val paths = pathsFrom(n as Node<TNodeId>)
            requireNotNull(paths, { "Path map missing for node $n" })
            return paths.keys as Set<NodeRolePlayer<TNodeId>>
        }
    }

    class UnvisitedNodesRole {
        fun Set<NodeRolePlayerAny>.hasNode(node: NodeRolePlayerAny): Boolean {
            return true
        }
    }

    class TentativeDistances {
        fun TentativeDistancesRolePlayer.distanceTo(node: NodeRolePlayerAny): Distance
            = this.getValue(node)

        fun TentativeDistancesRolePlayer.setDistanceTo(node: NodeRolePlayerAny, distance: Distance) {
            this[node] = distance
        }
    }

    class NeighborNodeRole {
        fun NodeRolePlayerAny.shorterPathAvailable(): Boolean {
            return true
//            val distanceFromStartToCurrent = TentativeDistances.distanceTo
        }
    }

    class CurrentNodeRole {
        private fun NodeRolePlayer<TNodeId>.unvisitedNeighbors(): List<NodeRolePlayerAny> {
            val self = this
            with (GraphRole()) {
                return Graph.neighborsOf(self).filter {
                    with (UnvisitedNodesRole()) {
                        UnvisitedNodes.hasNode(it)
                    }
                }
            }
        }

        private fun NodeRolePlayer<TNodeId>.determinePreviousInPath() {
            val self = this
            for (neighbor in unvisitedNeighbors()) {
                with (NeighborNodeRole()) {
                    if (neighbor.shorterPathAvailable()) {
                        ShortestPathSegments[neighbor] = self
                    }
                }
            }
        }

        private fun NodeRolePlayerAny.findClosestUnvisitedNode(): NodeRolePlayerAny {
            return UnvisitedNodes.first()
        }

        // visit this node, and determine the next closest unvisited node from the start
        fun NodeRolePlayerAny.traverse(): NodeRolePlayerAny? {
            markVisited()
            with (UnvisitedNodesRole()) {
                if (UnvisitedNodes.hasNode(DestinationNode)) {
                    return null;
                }
            }

            return findClosestUnvisitedNode()
        }

        fun NodeRolePlayerAny.markVisited() {
            UnvisitedNodes.remove(this)
        }
    }


    // Start: calculate the shortest path

    with (CurrentNodeRole()) {
        CurrentNode.markVisited()
    }

    with (GraphRole()) {
        println("Distance=${Graph.distanceBetweenNodes(Graph.nodes.first(), Graph.nodes.first())}")
    }
}