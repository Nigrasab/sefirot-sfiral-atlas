import { treeEdges } from '../data/treeEdges';

export function shortestPath(from: number, to: number): number[] {
  if (from === to) return [from];

  const adjacency: Record<number, number[]> = {};

  for (const [a, b] of treeEdges) {
    if (!adjacency[a]) adjacency[a] = [];
    if (!adjacency[b]) adjacency[b] = [];
    adjacency[a].push(b);
    adjacency[b].push(a);
  }

  const queue: number[][] = [[from]];
  const visited = new Set<number>([from]);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];

    for (const neighbor of adjacency[node] ?? []) {
      if (neighbor === to) {
        return [...path, neighbor];
      }

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return [];
}
