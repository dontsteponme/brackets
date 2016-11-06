import {IMatch} from 'interfaces/i-match';
import {ITeam} from 'interfaces/i-team';
import {ITournament} from 'interfaces/i-tournament';
import Match, {PendingMatch} from 'models/match';
import {PendingTeam} from 'models/team';

/**
 * Tournament models the tournament structure
 * It builds the brackets including future matches
 */
export default class Tournament implements ITournament {

  /**
   * Type of game
   * currently for display purposes
   */
  public static GAME_TYPE: string = 'match';

  /**
   * Source tree for all matches
   */
  public bracket: IMatch[][];

  /**
   * List of teams available to play
   * this kicks off the bracket setup
   */
  private _teams: ITeam[];
  get teams(): ITeam[] {
    return this._teams;
  }
  set teams(value: ITeam[]) {
    if (value !== this._teams) {
      this._teams = value;
      this._matchTeams(value);
    }
  }

  /**
   * Helper method to set the winner
   */
  public victory(path: number[], team: ITeam) {
    let match = this.getMatchAtPath(path);
    (match as Match).victor = team;

    let nextMatch = this.getNextMatch(path);
    if (nextMatch) {
      let spliceIndex: number = 0;
      if (nextMatch.teams[0] instanceof PendingTeam) {
        spliceIndex = 0;
      }
      else {
        spliceIndex = 1;
      }
      nextMatch.teams.splice(spliceIndex, 1, team);
      nextMatch.trigger('change');
    }
  }

  /**
   * Method to return subsequent match a team will play
   * - increments column
   */
  public getNextMatch(path: number[]): IMatch {
    let col = this.bracket[path[0] + 1];
    let match: IMatch;
    if (col) {
      match = col[Math.floor(path[1] / 2)];
    }
    return match;
  }

  /**
   * Fetches a bracket column
   */
  public getMatchesAtPath(path: number[]): IMatch[] {
    if (this.bracket) {
      return this.bracket[path[0]];
    }
    return [];
  }

  /**
   * Fetches a match at a specific path
   */
  public getMatchAtPath(path: number[]): IMatch {
    if (this.bracket) {
      return this.bracket[path[0]][path[1]];
    }
    console.warn('Brackets not instantiated');
    return null;
  }

  /**
   * Assigns teams to matches
   * populates a bracket
   */
  protected _matchTeams(teams: ITeam[]): void {
    let matches: IMatch[] = [];
    let match: IMatch;
    let last: number = teams.length - 1;
    teams.forEach((team: ITeam, index: number, array: any) => {
      if (match && match.teams.length === 1) {
        match.teams.push(team);
      }
      else {
        match = new Match();
        match.id = String(index / 2);
        match.teams = [team];
        match.gameType = Tournament.GAME_TYPE;
        matches.push(match);
      }
    });

    this.bracket = [matches];
    this._populatePending(matches);
    let lastBracket: IMatch[] = this.bracket[this.bracket.length - 1];
    this.bracket.push([lastBracket[lastBracket.length - 1]]);
  }

  /**
   * Creates bending matches for a bracket
   */
  private _populatePending(matches: IMatch[]): void {
    let pendingMatches: IMatch[] = [];
    let pending: PendingMatch;

    // switch up where byes happen so we
    // don't let one team "bye" their way to the top
    let byeIndex: number;
    let len: number = matches.length;
    if (len % 2 === 1) {
      if (matches[0].isBye) {
        byeIndex = len - 1;
      }
      else if (matches[len - 1].isBye) {
        byeIndex = 0;
      }
    }

    // pair up matches into pending match
    matches.forEach((match: IMatch, index: number, a: IMatch[]) => {
      if (pending && pending.pendingMatches.length === 1 && index !== byeIndex + 1) {
        pending.pendingMatches.push(match);
      }
      else {
        pending = new PendingMatch();
        pending.id = this.bracket.length + '.' + (index / 2);
        pending.pendingMatches = [match];
        pending.gameType = Tournament.GAME_TYPE;
        pendingMatches.push(pending);
      }
    });

    this.bracket.push(pendingMatches);
    if (pendingMatches.length > 1) {
      this._populatePending(pendingMatches);
    }
  }
}
