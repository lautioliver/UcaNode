export type VoteCounts = { up: number; down: number };

export function aggregateVotes(votes: { type: number }[]): VoteCounts {
  let up = 0;
  let down = 0;
  for (const vote of votes) {
    if (vote.type === 1) up += 1;
    else if (vote.type === -1) down += 1;
  }
  return { up, down };
}

export function getUserVoteFromList(
  votes: { type: number; perfilId: string }[],
  perfilId: string,
): 1 | -1 | null {
  const mine = votes.find((v) => v.perfilId === perfilId);
  if (!mine) return null;
  return mine.type === 1 ? 1 : -1;
}

export function voteScore(counts: VoteCounts): number {
  return counts.up - counts.down;
}
