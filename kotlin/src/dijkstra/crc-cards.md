## Graph

| Responsibilities | Collaborators |
| :--- | :--- |
| Finds unvisited neighbors | UnvisitedNodes |
| Tracks paths between nodes | |
| Knows distance between neighbors | |

## CurrentNode

| Responsibilities | Collaborators |
| :--- | :--- |
| Visit unvisited neighbors | UnvisitedNodes |
| | NeighborNode |
| | Graph |

## NeighborNode

| Responsibilities | Collaborators |
| :--- | :--- |
| Try to find a shorter path | CurrentNode |
| | TentativeDistances |
| | ShortestPathSegments |

## UnvisitedNodes

| Responsibilities | Collaborators |
| :--- | :--- |
| Tracks unvisited nodes | |
| Removes visited nodes | |

## TentativeDistances

| Responsibilities | Collaborators |
| :--- | :--- |
| Tracks tentative shortest distances between nodes | |

## ShortestPathSegments

| Responsibilities | Collaborators |
| :--- | :--- |
| Tracks shortest paths between nodes | |
