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

fun <TNodeId> CalculateShortestPath(
    graph: GraphRolePlayer<TNodeId>,
    startNode: NodeRolePlayer<TNodeId>,
    destinationNode: NodeRolePlayer<TNodeId>
): List<NodeRolePlayer<TNodeId>> {
    require(graph.contains(startNode) && graph.contains(destinationNode))
    return CalculateShortestPathContext(graph, startNode, destinationNode).calculate()
}

typealias NodeRolePlayer<TId> = Node<TId>

interface GraphRolePlayer<TNodeId> {
    fun pathsFrom(n: NodeRolePlayer<TNodeId>): Map<NodeRolePlayer<TNodeId>, Distance>?
    fun contains(n: NodeRolePlayer<TNodeId>): Boolean
    fun distanceBetween(x: NodeRolePlayer<TNodeId>, y: NodeRolePlayer<TNodeId>): Distance?
    val nodes: Set<NodeRolePlayer<TNodeId>>
}

private class CalculateShortestPathContext<TNodeId>(
    val graph: GraphRolePlayer<TNodeId>,
    val startNode: NodeRolePlayer<TNodeId>,
    val destinationNode: NodeRolePlayer<TNodeId>,
) {
    val unvisitedNodes = graph.nodes.toMutableSet()
    val shortestPathSegments = mutableMapOf<NodeRolePlayer<TNodeId>, NodeRolePlayer<TNodeId>>()
    val tentativeDistances = mutableMapOf<NodeRolePlayer<TNodeId>, Distance>()
        .apply {
            graph.nodes.forEach { this[it] = Distance.Infinity }
            this[startNode] = Distance(0f)
        }

    var currentNode = startNode

    fun calculate(): List<NodeRolePlayer<TNodeId>> {
        with(CurrentNodeRole()) {
            while (unvisitedNodes.contains(destinationNode)) {
                currentNode.traverse()

                val nextNode = unvisitedNodes.minByOrNull { tentativeDistances.getValue(it) }
                // break if no reachable nodes left or destination reached
                if (nextNode == null || tentativeDistances[nextNode] == Distance.Infinity) {
                    break
                }
                currentNode = nextNode
            }
        }
        return buildPath()
    }

    private fun buildPath(): List<NodeRolePlayer<TNodeId>> {
        val prevNodes = generateSequence(destinationNode) {
            shortestPathSegments[it]
        }
        val path = prevNodes
            .take(graph.nodes.size) // safety break: path can't be longer than total nodes
            .toList()
            .reversed() // put the nodes in order

        return if (path.firstOrNull() == startNode) path else emptyList()
    }

    // --- Roles ---

    inner class CurrentNodeRole {
        fun NodeRolePlayer<TNodeId>.traverse() {
            val neighbors = with(GraphRole()) {
                graph.unvisitedNeighborsOf(currentNode)
            }

            for (neighbor in neighbors) {
                with(NeighborNodeRole()) {
                    neighbor.evaluateShortestPath()
                }
            }
            unvisitedNodes.remove(this)
        }
    }

    inner class GraphRole {
        fun GraphRolePlayer<TNodeId>.unvisitedNeighborsOf(n: NodeRolePlayer<TNodeId>): List<NodeRolePlayer<TNodeId>> {
            return (pathsFrom(n)?.keys ?: emptySet()).filter { it in unvisitedNodes }
        }

        fun GraphRolePlayer<TNodeId>.distanceBetweenNodes(from: Node<TNodeId>, to: Node<TNodeId>): Distance {
            return distanceBetween(from, to)!!
        }
    }

    inner class NeighborNodeRole {
        /**
         * Is there a shorter path (from the start node to this neighbor node) than previously determined?
         */
        fun NodeRolePlayer<TNodeId>.evaluateShortestPath() {
            val distanceFromStartToCurrent = tentativeDistances.getValue(currentNode)
            val neighborNode = this
            val distanceToNeighbor = with (GraphRole()) {
                graph.distanceBetweenNodes(currentNode, neighborNode)
            }
            val newTotalDist = distanceFromStartToCurrent + distanceToNeighbor

            if (newTotalDist < (tentativeDistances[this] ?: Distance.Infinity)) {
                tentativeDistances[this] = newTotalDist
                shortestPathSegments[this] = currentNode
            }
        }
    }
}
