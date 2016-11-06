///<reference path="../../definitions/jasmine.d.ts"/>

import Team, {PendingTeam} from 'models/team';
import Match, {PendingMatch} from 'models/match';

describe('A Team', () => {
  it('should have a name', () => {
    let teamName = 'Namey McNamerson';
    let team = new Team();
    team.name =  teamName;

    expect(team.name).toEqual(teamName);
  });
});

describe('A Pending Team', () => {
  it('should have a name based on the pending match', () => {
    let match0 = new PendingMatch();
    match0.id = 'foo';
    let pendingTeam = new PendingTeam();
    pendingTeam.victorType = 'Loser';
    pendingTeam.pendingMatch = match0;
    expect(pendingTeam.name).toEqual('Loser of match foo');
  });
});
