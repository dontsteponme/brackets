import TournamentView from 'views/tournament-view';
import Tournament from 'models/tournament';

export default class Main {
  constructor() {
    var teams: any[] = [];
    var len = +localStorage.getItem('teamLength') || 10;
    for (var i = 0; i < len; i++) {
      teams.push({
        name: String(i)
      });
    }
    var t = window['t'] = new TournamentView();
    var body = document.getElementsByTagName('body')[0];
    var padding = 40; // +body.style.padding.replace('px', '') * 2;
    t.view.width = body.offsetWidth - padding;
    t.view.height = body.offsetHeight - padding;
    body.appendChild(t.view);
    t.tournament = new Tournament();
    t.tournament.teams = teams;
    t.draw();

    window.addEventListener('resize', () => {
      t.view.width = body.offsetWidth - padding;
      t.view.height = body.offsetHeight - padding;
      t.draw();
    });
  }
}