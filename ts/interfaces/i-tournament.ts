import {IMatch} from 'interfaces/i-match';
import {ITeam} from 'interfaces/i-team';

/**
 * ITournament describes a tournament model
 */
export interface ITournament {

  /**
   * Teams playing in a tournament
   */
  teams: ITeam[];

  /**
   * Bracket model
   * Tree of matches
   */
  bracket: IMatch[][];

  /**
   * Helper method to retieve a match
   */
  getMatchAtPath(path: number[]): IMatch;

  /**
   * Method to denote a victory in a given match
   */
  victory(path: number[], team: ITeam): void;
}