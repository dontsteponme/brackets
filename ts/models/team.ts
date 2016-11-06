import {IMatch} from 'interfaces/i-match';
import {ITeam} from 'interfaces/i-team';

/**
 * Team repsesents a class
 */
export default class Team implements ITeam {

  /**
   * Name of team
   */
  public name: string;
}

/**
 * PendingTeam represents a yet-unknown team to play
 * a future match
 */
export class PendingTeam implements ITeam {

  /**
   * Match that will determine team
   */
  public pendingMatch: IMatch;

  /**
   * Game type
   */
  public gameType: string;

  /**
   * Name to use for the winner
   */
  public victorType: string = 'Winner';

  /**
   * Name of team
   */
  get name(): string {
    if (this.pendingMatch && this.pendingMatch.isBye) {
      return '';
    }
    return `${this.victorType} of ${this.gameType} ${this.pendingMatch ? this.pendingMatch.id : 'nothing'}`;
  }

  constructor(pendingMatch?: IMatch, gameType: string = 'match') {
    this.pendingMatch = pendingMatch;
    this.gameType = gameType;
  }
}
