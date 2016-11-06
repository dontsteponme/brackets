import {IMatch} from 'interfaces/i-match';
import {ITeam} from 'interfaces/i-team';
import {IPoint} from 'interfaces/i-point';
import TeamView from 'views/team-view';

/**
 * MatchView displays two teams in a bracket
 *
 * Team 0
 * ------------
 *              \
 * Team 1       /
 * ------------
 *
 */
export default class MatchView {

  /**
   * X position of the view
   */
  public x: number;

  /**
   * Y position of the view
   */
  public y: number;

  /**
   * Width of the view
   */
  public width: number;

  /**
   * height of the view
   */
  public height: number;

  /**
   * Space to allow the angle of the bracket
   */
  public gutter: number = 0;

  /**
   * Which direction the angle should face
   */
  public direction: string;

  /**
   * Rendering context
   */
  private ctx: CanvasRenderingContext2D;

  /**
   * Model to back view
   */
  private _match: IMatch;
  get match(): IMatch {
    return this._match;
  }
  set match(value: IMatch) {
    if (value !== this._match) {
      this._match = value;
      this._match.on('change', () => {
        this.clear();
        this.draw(this.ctx);
      });
    }
  }

  /**
   * Midpoint where next bracket would start
   * ------------
   *              \_midpoint____
   *              /
   * ------------
   */
  get midpoint(): IPoint {
    let point: IPoint = {} as IPoint;
    point.y = this.y + this.width / 2;
    point.x = this.direction === 'right' ? this.x + this.width : 0;
    return point;
  }

  /**
   * Clear match view on canvas
   */
  public clear(): void {
    this.ctx.clearRect(this.x, this.y, this.width, this.y + this.height);
  }

  /**
   * Draw matchview
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    let isRight: boolean = 'right' === this.direction;
    let x: number = isRight ? this.x + this.gutter : this.x;
    let y: number = this.y;
    let width: number = this.width;
    let height: number = this.height;
    let team0: TeamView = new TeamView(this.match.teams[0], width - this.gutter - 5);
    let team1: TeamView = new TeamView(this.match.teams[1], width - this.gutter - 5);
    let fontSize: number = 12;

    this.ctx = ctx;
    ctx.font = `${fontSize}px sans-serif`;
    team0.x = x + 5;
    team0.y = y + fontSize;
    team0.draw(ctx);
    y += fontSize + 2;
    ctx.strokeStyle = "rgba(100, 100, 100, 1)";
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (height > 1) {
      ctx.lineTo(x + width - this.gutter, y);
      ctx.moveTo(x, y + height);
      ctx.lineTo(x + width - this.gutter, y + height);
      team1.x = x + 5;
      team1.y = y + height - 2;
      team1.draw(ctx);
      ctx.stroke();
      if (isRight) {
        ctx.moveTo(x, y + height);
        ctx.lineTo(x - this.gutter, y + height/2);
        ctx.lineTo(x, y);
      }
      else {
        ctx.lineTo(x + width, y + height/2);
        ctx.lineTo(x + width - this.gutter, y);
      }
    }
    else {
      ctx.lineTo(x + width, y);
    }
    ctx.stroke();
  }
}