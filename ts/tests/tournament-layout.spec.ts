///<reference path="../../definitions/jasmine.d.ts"/>

import Team, {PendingTeam} from 'models/team';
import Tournament from 'models/tournament';
import TournamentLayout, {ILayoutAttributes} from 'views/tournament-layout';

let layout: TournamentLayout;

/**
 * ------|
 * ------| ------|
 *               | ------
 * ------| ------|
 * ------|
 */
describe('A Tournament Layout', () => {
  beforeEach(() => {
    let tournament = new Tournament();
    let i: number = 0;
    let len: number = 4;
    let teams = [];
    for (i; i < len; i += 1) {
      let team = new Team();
      team.name = i.toString();
      teams.push(team);
    }
    tournament.teams = teams;

    layout = new TournamentLayout();
    layout.width = 300;
    layout.height = 400;
    layout.tournament = tournament;
  });

  it('should get a path at a point', () => {
    expect(layout.getPathAtPoint(10, 10)[0]).toEqual(0);
    expect(layout.getPathAtPoint(10, 10)[1]).toEqual(0);
    expect(layout.getPathAtPoint(150, 150)[0]).toEqual(1);
    expect(layout.getPathAtPoint(150, 150)[1]).toEqual(0);
  });

  it('should get layout attributes at a point', () => {
    let la = layout.getLayoutAttributeAtPoint(0, 0);
    expect(la.height).toEqual(100);
    expect(la.width).toEqual(100);
    expect(la.x).toEqual(0);
    expect(la.y).toEqual(0);
  });

  it('should get layout attributes at a path', () => {
    let la = layout.getLayoutAttributes([1,0]);
    expect(la.x).toEqual(100);
    expect(la.y).toEqual(50);
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
  it('should determine bye locations', () => {
    let tournament = new Tournament();
    let i: number = 0;
    let len: number = 5;
    let teams = [];
    for (i; i < len; i += 1) {
      let team = new Team();
      team.name = i.toString();
      teams.push(team);
    }
    tournament.teams = teams;

    layout.tournament = tournament;

    expect((layout as any).byeIndices.length).toEqual(2);
    expect((layout as any).byeIndices[1]).toEqual(0);
  });
});
