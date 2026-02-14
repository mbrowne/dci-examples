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
typealias UnvisitedNodesRolePlayer = MutableSet<NodeRolePlayerAny>
typealias TentativeDistancesRolePlayer = MutableMap<NodeRolePlayerAny, Distance>

fun <TNodeId : Any> CalculateShortestPath(
    Graph: GraphRolePlayer<TNodeId>,
    StartNode: NodeRolePlayerAny,
    DestinationNode: NodeRolePlayerAny
) {
    require(Graph.contains(StartNode as Node<TNodeId>) && Graph.contains(DestinationNode as Node<TNodeId>))

    val UnvisitedNodes = Graph.nodes.toMutableSet() as MutableSet<NodeRolePlayerAny>
    val ShortestPathSegments = HashMap<NodeRolePlayerAny, NodeRolePlayerAny>()
    val CurrentNode = StartNode
    var NeighborNode: NodeRolePlayerAny

    val TentativeDistances: TentativeDistancesRolePlayer = mutableMapOf<NodeRolePlayerAny, Distance>(
        StartNode to Distance(0f)
    )

//    class GraphRole {
//        // fun GraphRolePlayer.distanceBetween(from: Node, to: Node): Distance = this.distanceBetween(from, to)
//        fun GraphRolePlayer<TNodeId>.distanceBetweenNodes(from: NodeRolePlayer<TNodeId>, to: NodeRolePlayer<TNodeId>): Distance? =
//            distanceBetween(from as Node<TNodeId>, to as Node<TNodeId>)
//
//        fun GraphRolePlayer<TNodeId>.neighborsOf(n: NodeRolePlayer<TNodeId>): Set<NodeRolePlayer<TNodeId>> {
//            val paths = pathsFrom(n as Node<TNodeId>)
//            requireNotNull(paths, { "Path map missing for node $n" })
//            return paths.keys as Set<NodeRolePlayer<TNodeId>>
//        }
//    }
//
//    class UnvisitedNodesRole {
//        fun Set<NodeRolePlayerAny>.hasNode(node: NodeRolePlayerAny): Boolean {
//            return true
//        }
//    }
//
//    class TentativeDistancesRole {
//        fun TentativeDistancesRolePlayer.distanceTo(node: NodeRolePlayerAny): Distance
//                = this.getValue(node)
//
//        fun TentativeDistancesRolePlayer.setDistanceTo(node: NodeRolePlayerAny, distance: Distance) {
//            this[node] = distance
//        }
//    }
//
//    class NeighborNodeRole {
//        fun NodeRolePlayerAny.shorterPathAvailable(): Boolean {
//            val distanceFromStartToCurrent: Distance
//            val netDistance: Distance
//            with(TentativeDistancesRole()) {
//                distanceFromStartToCurrent = TentativeDistances.distanceTo(CurrentNode)
//            }
//            with(CurrentNodeRole()) {
//                // TODO
//                // TEMP
//                netDistance = distanceFromStartToCurrent + Distance(2f)
//            }
//        }
//    }
//
//    class CurrentNodeRole {
//        private fun NodeRolePlayer<TNodeId>.unvisitedNeighbors(): List<NodeRolePlayerAny> {
//            val self = this
//            with (GraphRole()) {
//                return Graph.neighborsOf(self).filter {
//                    with (UnvisitedNodesRole()) {
//                        UnvisitedNodes.hasNode(it)
//                    }
//                }
//            }
//        }
//
//        private fun NodeRolePlayer<TNodeId>.determinePreviousInPath() {
//            val self = this
//            for (neighbor in unvisitedNeighbors()) {
//                with (NeighborNodeRole()) {
//                    if (neighbor.shorterPathAvailable()) {
//                        ShortestPathSegments[neighbor] = self
//                    }
//                }
//            }
//        }
//
//        private fun NodeRolePlayerAny.findClosestUnvisitedNode(): NodeRolePlayerAny {
//            return UnvisitedNodes.first()
//        }
//
//        // visit this node, and determine the next closest unvisited node from the start
//        fun NodeRolePlayerAny.traverse(): NodeRolePlayerAny? {
//            markVisited()
//            with (UnvisitedNodesRole()) {
//                if (UnvisitedNodes.hasNode(DestinationNode)) {
//                    return null;
//                }
//            }
//
//            return findClosestUnvisitedNode()
//        }
//
//        fun NodeRolePlayerAny.markVisited() {
//            UnvisitedNodes.remove(this)
//        }
//    }

    // Start: calculate the shortest path

    CalculateShortestPathContext(
        Graph, CurrentNode, DestinationNode, UnvisitedNodes, TentativeDistances
    ).calculate()

//    while ($nextUnvisitedNode = $this->currentNode->traverse()) {
//        $this->currentNode = $nextUnvisitedNode->addRole('CurrentNode', $this);
//    }
//
//    $segments = [];
//    for (
//    $n = $this->destinationNode;
//    $n != $this->startNode;
//    $n = $this->shortestPathSegments->getPreviousNode($n)
//    ) {
//        $segments[] = $n;
//    }
//    $startToEnd = array_reverse($segments);
//    return array_merge([$this->startNode], $startToEnd);

}

private class CalculateShortestPathContext<TNodeId>(
    val Graph: GraphRolePlayer<TNodeId>,
    val CurrentNode: NodeRolePlayer<TNodeId>,
    val DestinationNode: NodeRolePlayerAny,
    val UnvisitedNodes: MutableSet<NodeRolePlayerAny>,
    val TentativeDistances: MutableMap<NodeRolePlayerAny, Distance>
    ) {

    fun calculate() {
        with(CurrentNodeRole()) {
            CurrentNode.markVisited()
        }
        for (n in UnvisitedNodes) {
            with(TentativeDistancesRole()) {
                TentativeDistances.setDistanceTo(n, Distance(Float.POSITIVE_INFINITY))
            }
        }
        with(CurrentNodeRole()) {
            CurrentNode.traverse()
        }
    }

    inner class GraphRole {
        // fun GraphRolePlayer.distanceBetween(from: Node, to: Node): Distance = this.distanceBetween(from, to)
        fun GraphRolePlayer<TNodeId>.distanceBetweenNodes(
            from: NodeRolePlayer<TNodeId>,
            to: NodeRolePlayer<TNodeId>
        ): Distance {
            val dist = distanceBetween(from as Node<TNodeId>, to as Node<TNodeId>)
            require(dist != null)
            return dist
        }

        fun GraphRolePlayer<TNodeId>.neighborsOf(n: NodeRolePlayer<TNodeId>): Set<NodeRolePlayer<TNodeId>> {
            val paths = pathsFrom(n as Node<TNodeId>)
            requireNotNull(paths, { "Path map missing for node $n" })
            return paths.keys as Set<NodeRolePlayer<TNodeId>>
        }
    }

    inner class CurrentNodeRole {
        private fun NodeRolePlayer<TNodeId>.unvisitedNeighbors(): List<NodeRolePlayer<TNodeId>> {
            with(GraphRole()) {
                Graph.neighborsOf(CurrentNode)
                return Graph.neighborsOf(CurrentNode).filter {
                    with(UnvisitedNodesRole()) {
                        UnvisitedNodes.hasNode(it as NodeRolePlayerAny)
                    }
                }
            }
        }

        private fun NodeRolePlayer<TNodeId>.determinePreviousInPath() {
            for (neighbor in unvisitedNeighbors()) {
                val tmp = NeighborNodeRole()
                //                with (NeighborNodeRole()) {
                //                    if (neighbor.shorterPathAvailable()) {
                //                        ShortestPathSegments[neighbor] = CurrentNode
                //                    }
                //                }
            }
        }

        private fun NodeRolePlayer<TNodeId>.findClosestUnvisitedNode(): NodeRolePlayerAny? {
            determinePreviousInPath()
            if (UnvisitedNodes.isEmpty()) {
                return null
            }
            return UnvisitedNodes.minBy { node ->
                with(TentativeDistancesRole()) {
                    TentativeDistances.distanceTo(node)
                }
            }
        }

        // visit this node, and determine the next closest unvisited node from the start
        fun NodeRolePlayer<TNodeId>.traverse(): NodeRolePlayerAny? {
            markVisited()
            with(UnvisitedNodesRole()) {
                if (UnvisitedNodes.hasNode(DestinationNode)) {
                    return null;
                }
            }
            return findClosestUnvisitedNode()
        }

        fun NodeRolePlayer<TNodeId>.markVisited() {
            UnvisitedNodes.remove(this as NodeRolePlayerAny)
        }

        fun NodeRolePlayer<TNodeId>.distanceTo(neighbor: NodeRolePlayerAny): Distance =
            with(GraphRole()) {
                Graph.distanceBetweenNodes(CurrentNode, neighbor as NodeRolePlayer<TNodeId>)
            }
    }

    class UnvisitedNodesRole {
        fun UnvisitedNodesRolePlayer.removeNode(node: NodeRolePlayerAny) {
            remove(node)
        }

        fun UnvisitedNodesRolePlayer.hasNode(node: NodeRolePlayerAny): Boolean {
            return contains(node)
        }
    }

    class TentativeDistancesRole {
        fun TentativeDistancesRolePlayer.distanceTo(node: NodeRolePlayerAny): Distance = this.getValue(node)

        fun TentativeDistancesRolePlayer.setDistanceTo(node: NodeRolePlayerAny, distance: Distance) {
            this[node] = distance
        }
    }

    class NeighborNodeRole {
        fun shorterPathAvailable() = false
        /**
         * Is there a shorter path (from the start node to this node) than previously determined?
         */
        //        fun NodeRolePlayerAny.shorterPathAvailable(): Boolean {
        //            val distanceFromStartToCurrent: Distance
        //            val netDistance: Distance
        //            with (TentativeDistancesRole()) {
        //                distanceFromStartToCurrent = TentativeDistances.distanceTo(CurrentNode)
        //            }
        //            with (CurrentNodeRole()) {
        //                // TODO
        //                // TEMP
        //                netDistance = distanceFromStartToCurrent + Distance(2f)
        //            }
        //
        //            with (TentativeDistancesRole()) {
        //                val distanceToSelf = TentativeDistances.distanceTo(NeighborNode)
        //                if (netDistance < distanceToSelf) {
        //                    TentativeDistances.setDistanceTo(NeighborNode, netDistance)
        //                    return true
        //                }
        //                return false
        //            }
        //        }
    }
}
