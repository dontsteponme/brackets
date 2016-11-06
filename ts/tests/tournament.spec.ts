///<reference path="../../definitions/jasmine.d.ts"/>

import Team, {PendingTeam} from 'models/team';
import Tournament from 'models/tournament';
import Match, {PendingMatch} from 'models/match';

let tournament: Tournament;
let teams: Team[];

/**
 * ------|
 * ------| ------|
 *               | ------
 * ------| ------|
 * ------|
 */
describe('A Tournament', () => {
  beforeEach(() => {
    tournament = new Tournament();
    let i: number = 0;
    let len: number = 4;
    teams = [];
    for (i; i < len; i += 1) {
      let team = new Team();
      team.name = i.toString();
      teams.push(team);
    }
    tournament.teams = teams;
  });

  it('should populate brackets from teams', () => {
    expect(tournament.bracket).toBeDefined();
    expect(tournament.bracket.length).toEqual(3);
    expect(tournament.bracket[0].length).toEqual(2);
  });

  it('should get matches at path', () => {
    expect(tournament.getMatchesAtPath([1,0]).length).toEqual(1);
  });

  it('should get match at path', () => {
    expect(tournament.getMatchAtPath([0, 1]).teams[0]).toEqual(teams[2]);
  });

  it('should get then next match for a team', () => {
    let nextMatch = tournament.bracket[1][0];
    expect(tournament.getNextMatch([0,0])).toEqual(nextMatch);
    expect(tournament.getNextMatch([0,1])).toEqual(nextMatch);
  });

  it('should assign a victor', () => {
    let winner = teams[0];
    tournament.victory([0,0], winner);

    expect(tournament.getMatchAtPath([1,0]).teams[0]).toEqual(winner);
    expect(tournament.getMatchAtPath([0,0]).victor).toEqual(winner);
  });

  /**
   * ------|
   * ------| ------  ------|
   *                       |
   * ------|               | ------
   * ------| ------|       |
   *               | ------|
   * ------ _______|
   */
  it('should assign byes', () => {
    let i: number = 0;
    let len: number = 5;
    teams = [];
    for (i; i < len; i += 1) {
      let team = new Team();
      team.name = i.toString();
      teams.push(team);
    }
    tournament.teams = teams;

    expect(tournament.getMatchAtPath([0,2]).isBye).toEqual(true);
    expect(tournament.getMatchAtPath([1,0]).isBye).toEqual(true);

  });
});
