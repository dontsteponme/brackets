///<reference path="../../definitions/jasmine.d.ts"/>

import {IMatch} from 'interfaces/i-match';
import Match, {PendingMatch} from 'models/match';
import Team, {PendingTeam} from 'models/team';

let match: IMatch;
let pendingMatch: PendingMatch;
let team: Team;
let team2: Team;
let team3: Team;
let team4: Team;

describe('A Match', () => {
  beforeEach(() => {
    match = new Match();
    team = new Team();
    team.name = 'foo';
    match.teams = [team];
  });

  it('should know when it is a bye', () => {
    expect(match.isBye).toEqual(true);
  });

  it('should know the victor when a bye', () => {
    expect(match.victor).toEqual(team);
  });
});

describe('A Pending Match', () => {
  beforeEach(() => {
    team = new Team();
    team.name = 'foo';
    team2 = new Team();
    team2.name = 'bar';
    team3 = new Team();
    team3.name = 'cubs';
    team4 = new Team();
    team4.name = 'bears';

    let match0 = new Match();
    match0.id = 'best';
    match0.teams = [team, team2];
    let match1 = new Match();
    match1.gameType = 'game';
    match1.id = 'bestest';
    match1.teams = [team2, team3];

    match = new PendingMatch();
    (match as PendingMatch).pendingMatches = [match0, match1];
  });

  it('should know the pending teams playing', () => {
    let teams = match.teams;
    expect(teams[0].name).toEqual('Winner of match best');
    expect(teams[1].name).toEqual('Winner of game bestest');
  });

  it('should know the winning teams playing', () => {
    let matches = (match as PendingMatch).pendingMatches;
    let match0 = matches[0];
    let match1 = matches[1];

    match0.victor = team;
    match1.victor = team4;

    expect(match.teams[0]).toEqual(team);
    expect(match.teams[1]).toEqual(team4);
  });

  it('should know when it is a bye', () => {
    let match0 = new Match();
    match0.id = 'best';
    match0.teams = [team, team2];
    (match as PendingMatch).pendingMatches = [match0];

    expect(match.isBye).toEqual(true);
  });

  it('should handle one match', () => {
    let match0 = new Match();
    match0.id = 'best';
    match0.teams = [team, team2];
    (match as PendingMatch).pendingMatches = [match0];

    expect(match.teams.length).toEqual(2);
    expect(match.isBye).toEqual(true);

  });
});
