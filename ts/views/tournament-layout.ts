import {IMatch} from 'interfaces/i-match';
import {ITournament} from 'interfaces/i-tournament';

/**
 * TournamentLayout is the layout handler for the tournament view
 * It handles the positioning of each bracket and
 * subsequent request for attributes of the view
 */
export default class TournamentLayout {

  /**
   * Width of the tournament view
   */
  public width: number = 0;

  /**
   * height of the tournament view
   */
  public height: number = 0;

  /**
   * How large of a gap between brackets
   * percentage based on bracket height
   */
  public gapPercentage: number = 1; // 0 - 1 percentage of cell height

  /**
   * direction the bracket is facing
   * left === left to right
   * right === right to left
   */
  public direction: string = 'left';

  /**
   * index per column where there is a bye
   * normally 0 or length - 1
   */
  private byeIndices: number[] = [];

  /**
   * Model for tournament
   */
  private _tournament: ITournament;
  get tournament(): ITournament {
    return this._tournament;
  }
  set tournament(value: ITournament) {
    if (value !== this._tournament) {
      this._tournament = value;
      this.getByeIndicies();
    }
  }

  /**
   * return positioning of a match
   */
  public getLayoutAttributeAtPoint(x: number, y: number): ILayoutAttributes {
    return this.getLayoutAttributes(this.getPathAtPoint(x,y));
  }

  /**
   * Return a bracket path from an x/y coordinate
   */
  public getPathAtPoint(x: number, y: number): number[] {
    let bracket: IMatch[][] = this.tournament.bracket;
    let columns: number = bracket.length;
    let columnWidth: number = this.width / columns;
    let columnIndex = Math.floor(x / columnWidth);
    if (this.direction === 'right') {
      columnIndex = Math.floor((this.width - x) / columnWidth);
    }
    let column = bracket[columnIndex];
    let rowHeight: number = this.height / (bracket[0].length * 2);
    let rowIndex: number = Math.floor(y / rowHeight / (Math.pow(2, columnIndex) || 1) / 2);
    return [columnIndex, rowIndex];
  }

  /**
   * Gets size and poisition of an item based on its path
   */
  public getLayoutAttributes(path: number[]): ILayoutAttributes {
    let bracket: IMatch[][] = this.tournament.bracket;
    let columnIndex: number = path[0];
    let columns: number = bracket.length;
    let columnWidth: number = this.width / columns;
    let x: number = columnWidth * columnIndex;
    let height: number;
    let y: number;
    let rowIndex: number = path[1];
    let prevColIndex: number = path[0] - 1;
    let byeIndex: number = this.byeIndices[path[0]]; // index at which a bye is available per column

    if (columnIndex === 0) {
      height = this.height / (bracket[0].length * 2);
      y = rowIndex * height + rowIndex * height * this.gapPercentage;
      if (rowIndex === byeIndex) {
        height = 1;
      }
    }
    else {
      let prevIndex: number = rowIndex * 2;
      let previousPath: number[] = [prevColIndex, prevIndex];
      let prevLayout0: ILayoutAttributes = this.getLayoutAttributes(previousPath);
      let prevLayout1: ILayoutAttributes = this.getLayoutAttributes([prevColIndex, prevIndex + 1]);

      if (rowIndex === byeIndex) {
        height = 1;
        y = prevLayout0.y + prevLayout0.height / 2;
      }
      else if (rowIndex - 1 === byeIndex) {
        prevLayout0 = this.getLayoutAttributes([prevColIndex, rowIndex]);
        prevLayout1 = this.getLayoutAttributes([prevColIndex, rowIndex + 1]);

        // adjust for bye previously
        height = prevLayout1.y - prevLayout0.y;
        if (prevLayout1.height === 1) {
          height -= prevLayout0.height / 2;
        }
        if (prevLayout0.height === 1) {
          height -= prevLayout1.height / 2;
        }
        y = prevLayout0.y + prevLayout0.height / 2;
      }
      else {
        height = prevLayout1.y - prevLayout0.y;
        if (prevLayout0.height === 1) {
          height += prevLayout1.height / 2;
        }
        if (prevLayout1.height === 1) {
          height -= prevLayout0.height / 2;
        }

        y = prevLayout0.y + prevLayout0.height / 2;
      }
    }

    if (this.direction === 'right') {
      x = this.width - x - columnWidth;
    }

    return {
      x: x,
      y: y,
      width: columnWidth,
      height: height
    };
  }

  /**
   * Determines where there is a bye in the model
   */
  private getByeIndicies(): void {
    let b = this._tournament.bracket;
    b.forEach((value: IMatch[], index: number, array: IMatch[][]) => {
      value.forEach((match: IMatch, i: number, array: IMatch[]) => {
        if (match.isBye) {
          this.byeIndices[index] = i;
        }
      });
    });
  }
}

/**
 * Interface for attributes of an item on screen
 */
export interface ILayoutAttributes {
  x: number,
  y: number,
  width: number,
  height: number
}