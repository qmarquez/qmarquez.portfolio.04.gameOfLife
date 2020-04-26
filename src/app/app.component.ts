import { Component } from '@angular/core';
import config from '../config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public side = config.INITIAL_SIDE;
  public cellSize: any;
  lastCellChanged: string;
  gameAux: number;

  public board: Array<Array<{ value: number, row: number }>>;

  constructor() {
    this.newBoard(this.side);
    this.cellSize = this.getCellSize()
  }

  getCellSize() {
    const size = { "width.%": 0, "height.%": 0 };

    size["height.%"] = size["width.%"] = 100 / this.side;

    return size;
  }

  newBoard(side: number) {
    this.board = new Array(side);
    for (let row = 0; row < side; row++) {
      this.board[row] = [];
      for (let cell = 0; cell < side; cell++) {
        this.board[row].push({ value: 0, row });
      }
    }
    this.cellSize = this.getCellSize();
  }

  updateSide({ value }) {
    this.side = parseInt(value) || 0;
    this.newBoard(this.side);
    this.stopGame();
  }

  handleClick(iRow: number, iCell: number) {
    this.toggleCell(iRow, iCell);
    this.lastCellChanged = `${iRow}${iCell}`;
  }

  handleMouse(iRow: number, iCell: number, { buttons }) {
    if (buttons === 1 && this.lastCellChanged !== `${iRow}${iCell}`) {
      this.lastCellChanged = `${iRow}${iCell}`;
      this.toggleCell(iRow, iCell);
    }
  }

  toggleCell(row: number, cell: number) {
    this.board[row][cell].value = this.board[row][cell].value ? 0 : 1;
  }

  playGame() {
    this.stopGame();
    this.setMove();
  }

  setMove = () => {
    debugger;
    const auxBoard = [];
    for (const [iRow, row] of this.board.entries()) {
      auxBoard.push([...row]);
      for (const [iCell, { value, row: rowNumber }] of row.entries()) {
        const alives =
          this.board[this.sideMod(iRow - 1)][this.sideMod(iCell - 1)].value +
          this.board[this.sideMod(iRow - 1)][this.sideMod(iCell)].value +
          this.board[this.sideMod(iRow - 1)][this.sideMod(iCell + 1)].value +
          this.board[this.sideMod(iRow)][this.sideMod(iCell - 1)].value +
          this.board[this.sideMod(iRow)][this.sideMod(iCell + 1)].value +
          this.board[this.sideMod(iRow + 1)][this.sideMod(iCell - 1)].value +
          this.board[this.sideMod(iRow + 1)][this.sideMod(iCell)].value +
          this.board[this.sideMod(iRow + 1)][this.sideMod(iCell + 1)].value;

        if (value === 0 && alives === 3) {
          auxBoard[iRow][iCell] = { value: 1, row: rowNumber };
        } else if (value === 1 && (alives < 2 || 3 < alives)) {
          auxBoard[iRow][iCell] = { value: 0, row: rowNumber };
        }
      }
    }

    this.board = auxBoard;
    this.gameAux = setTimeout(this.setMove, 100);
  }

  sideMod(n: number) {
    return ((n % this.side) + this.side) % this.side;
  }

  stopGame() {
    if (this.gameAux) {
      clearTimeout(this.gameAux);
      this.gameAux = undefined;
    }
  }

  rowTrackBy(index: number, row: Array<number>) {
    return index + '' + row.reduce((acc, curr) => acc + curr, '');
  }

  cellTrackBy(index: number, cell: { value: number, row: number }) {
    return index + '' + cell.row + '' + cell.value;
  }

}
