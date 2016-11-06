import {IEventer} from 'interfaces/i-eventer';
import {ITeam} from 'interfaces/i-team';

/**
 * IMatch describes a match betwixt oponents
 */
export interface IMatch extends IEventer {

  /**
   * Teams playing in match
   */
  teams: ITeam[];

  /**
   * Winning team from array
   */
  victor: ITeam;

  /**
   * Optional id of match
   */
  id?: string;

  /**
   * Optional gametype
   * example: Match, Game, Bout
   */
  gameType?: string;

  /**
   * Optional flag to indicate team has a bye
   */
  isBye?: boolean;
}