import type { ILocalStore } from '@/types/store';

import type { IReactionDisposer } from 'mobx';

export abstract class LocalStore implements ILocalStore {
  private reactionDisposers: IReactionDisposer[] = [];

  addReaction(reaction: IReactionDisposer): void {
    this.reactionDisposers.push(reaction);
  }

  addReactions(reactions: IReactionDisposer[]): void {
    for (const r of reactions) {
      this.reactionDisposers.push(r);
    }
  }

  destroyReactions(): void {
    this.reactionDisposers.forEach((disposer) => disposer());
  }

  destroy(): void {
    this.destroyReactions();
  }
}
