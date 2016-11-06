import {IMatch} from 'interfaces/i-match';
import {ITeam} from 'interfaces/i-team';
import {ITournament} from 'interfaces/i-tournament';
import MatchView from 'views/match-view';
import ChampionView from 'views/champion-view';
import Tournament from 'models/tournament';
import TournamentLayout, {ILayoutAttributes} from 'views/tournament-layout';

/**
 * View that controlls the brackets
 */
export default class TournamentView {

  /**
   * Model for view
   */
  public tournament: ITournament;

  /**
   * layout for view
   */
  public layout: TournamentLayout;

  /**
   * Array of views which represent the tournament
   */
  private bracketView: MatchView[][] = [];

  /**
   * Rendering context
   */
  private ctx: CanvasRenderingContext2D;

  /**
   * Canvas Element
   */
  private _view: HTMLCanvasElement;
  get view(): HTMLCanvasElement {
    if (!this._view) {
      this._view = document.createElement('canvas');
      this.addListeners();
    }
    return this._view;
  }
  set view(value: HTMLCanvasElement) {
    this._view = value;
  }

  constructor(tournament?: ITournament, view?: HTMLCanvasElement) {
    this.tournament = tournament;
    this._view = view;
  }

  /**
   * Clean up the view
   */
  public destroy() {
    this.tournament = null;

    // TODO: destroy all MatchViews
    this.bracketView = null;
  }

  /**
   * Draw the brackets
   */
  public draw(ctx?: CanvasRenderingContext2D): void {
    if (this.tournament) {
      if (!this.layout) {
        this.layout = new TournamentLayout();
        this.layout.tournament = this.tournament;
      }
      this.layout.width = this.view.offsetWidth;
      this.layout.height = this.view.offsetHeight;
      this.layout.direction = 'left';

      let bracket: IMatch[][] = this.tournament.bracket;
      this.ctx = ctx = ctx || this.ctx || this.view.getContext('2d');
      this.clear(ctx);

      bracket.forEach((matches: IMatch[], index: number, array: IMatch[][]) => {
        let isChampionView: boolean = index === bracket.length - 1;
        matches.forEach((match: IMatch, i: number, m: IMatch[]) => {
          let path = [index, i];
          let layoutAttributes = this.layout.getLayoutAttributes(path);
          let matchView;
          if (isChampionView) {
            matchView = new ChampionView();
          }
          else {
            matchView = new MatchView();
          }
          matchView.direction = this.layout.direction;
          matchView.gutter = 20;
          matchView.match = this.tournament.getMatchAtPath(path);
          matchView.width = layoutAttributes.width;
          matchView.height = layoutAttributes.height;
          matchView.x = layoutAttributes.x;
          matchView.y = layoutAttributes.y;
          matchView.draw(ctx);

          // cache views
          let bracket = this.bracketView[index];
          if (!bracket) {
            bracket = this.bracketView[index] = [];
          }
          bracket[i] = matchView;
        });
      });
    }
    else {
      console.warn('No tournament model available');
    }
  }

  /**
   * Clear the view
   */
  private clear(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.view.width, this.view.height);
  }

  /**
   * Add event listeners
   */
  private addListeners(): void {
    this._view.addEventListener('mousedown', this.handleDown, false);
    this._view.addEventListener('touchstart', this.handleDown, false);
  }

  /**
   * handle down press
   */
  private handleDown = (event: MouseEvent) => {
    window.addEventListener('mouseup', this.handleUp, false);
    window.addEventListener('touchend', this.handleUp, false);
  }

  private handleUp = (event: MouseEvent) => {
    window.removeEventListener('mouseup', this.handleUp, false);
    window.removeEventListener('touchend', this.handleUp, false);

    var x: number = event.clientX - this.view.offsetLeft;
    var y: number = event.clientY - this.view.offsetTop;
    var path: number[] = this.layout.getPathAtPoint(x, y);

    var matchView: MatchView = this.bracketView[path[0]][path[1]];
    var winner: ITeam;
    if (y < matchView.y + matchView.height / 2) {
      winner = matchView.match.teams[0];
    }
    else {
      winner = matchView.match.teams[1];
    }
    this.tournament.victory(path, winner);
  }
}