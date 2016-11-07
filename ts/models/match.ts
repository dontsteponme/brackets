import {IMatch} from 'interfaces/i-match';
import {ITeam} from 'interfaces/i-team';
import {PendingTeam} from 'models/team';
import Eventer from 'models/eventer';

/**
 * A Match models a single game betwixt teams
 */
export default class Match extends Eventer implements IMatch {

  /**
   * ID of match
   */
  public id: string;

  /**
   * Type of game for display purposes
   */
  public gameType: string = 'match';

  /**
   * Teams associated with match
   */
  public teams: ITeam[];

  /**
   * Winner, winner, chicken dinner
   */
  private _victor: ITeam;
  get victor(): ITeam {
    if (!this._victor && this.isBye) {
      this._victor = this.teams[0];
    }
    return this._victor;
  }
  set victor(value: ITeam) {
    this._victor = value;
  }

  /**
   * Determines that bracket is a bye for one team
   */
  get isBye(): boolean {
    return this.teams && this.teams.length === 1;
  }
}

/**
 * Models matches yet to come
 */
export class PendingMatch extends Eventer implements IMatch {

  /**
   * ID used for ... identification
   */
  public id: string;

  /**
   * Matches that this match depend on to get teams
   */
  public pendingMatches: IMatch[];

  /**
   * Winner of pending match
   * Pete Rose Style
   */
  public victor;

  /**
   * Type of game for display purposes
   */
  public gameType: string = 'match';

  /**
   * Teams available to play match
   */
  get teams(): ITeam[] {
    if (this.pendingMatches) {
      let teams: ITeam[] = [];
      let match0 = this.pendingMatches[0];
      if (match0 && match0.victor) {
        teams.push(match0.victor);
      }
      else {
        teams.push(new PendingTeam(match0, match0.gameType));
      }
      let match1 = this.pendingMatches[1];
      if (match1 && match1.victor) {
        teams.push(match1.victor);
      }
      else {
        teams.push(new PendingTeam(match1, match1 ? match1.gameType : this.gameType));
      }
      return teams;
    }
    return [];
  }

  /**
   * Do the pending matches lead to a bye?
   */
  private _isBye: boolean;
  get isBye(): boolean {
    let isBye: boolean = this._isBye;
    if (this.pendingMatches) {
      if (this.pendingMatches.length === 1) {
        isBye = true;
      }
      else {
        this.pendingMatches.forEach((m: IMatch, index: number, array: IMatch[]) => {
          isBye = isBye || !m;
        });
      }
    }
    return isBye;
  }

  constructor(pendingMatchs?: IMatch[], isBye?: boolean, gameType?: string) {
    super();
    this.pendingMatches = pendingMatchs;
    this.gameType = gameType;
    this._isBye = !!isBye;
  }
}
