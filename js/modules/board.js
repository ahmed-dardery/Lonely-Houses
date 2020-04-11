import {cellstate, colors, houseColors} from './utils.js'
import Rect from './rect.js'

export default class Board {
    constructor(count, screen) {
        this._width = count;
        this._height = count;
        this._cell_count2 = this._width * this._height;
        this._border_size = 3;
        this._margin = 2;
        this._cell_size = 60;

        this._cellmargin = 4;

        this.cells = Array(this._cell_count2);
        this.cells.fill(cellstate.empty);

        this.cellsValid = Array(this._cell_count2);
        this.cellsValid.fill(true);

        this.borderColor = colors.black;

        this.cellColor = colors.white;
        this.cellInvalidColor = colors.pink;

        this.cellHighlightedColor = colors.lightyellow;
        this.cellHighlightedInvalidColor = colors.darkpink;
        this.highlighted = null;

        this.setScreen(screen);
    }

    getMargin() {
        return this._margin * this._drawconst
    }

    getBorderSize() {
        return this._border_size * this._drawconst
    }

    getCellSize() {
        return this._cell_size * this._drawconst
    }

    getTotalSize() {
        return this._totalsize * this._drawconst
    }

    setScreen(screen) {
        this._totalsize = 2 * this._border_size + this._margin * (this._width - 1) + this._width * this._cell_size;
        this._drawconst = screen[2] / this._totalsize;
        this._offsetx = screen[0];
        this._offsety = screen[1];
    }


    getState(ind) {
        return this.cells[ind];
    }
    
    checkCell(ind) {
        if (this.cells[ind] <= cellstate.house1) {
            this.cellsValid[ind] = true;
            return;
        }
        let around = Array(6);
        around.fill(false);

        const i = Math.floor(ind / this._width);
        const j = ind % this._width;

        const di = [1, -1, 0, 0];
        const dj = [0, 0, 1, -1];
        for (let k = 0; k < 4; ++k) {
            const ni = i + di[k];
            const nj = j + dj[k];
            if (ni < 0 || ni >= this._height || nj < 0 || nj >= this._width) continue;
            around[this.cells[ni * this._width + nj]] = true;
        }
        this.cellsValid[ind] = !(around.slice(1, this.cells[ind]).includes(false))
    }

    triggerCell(ind, reverse) {
        if (ind == null) return;
        if (reverse) this.cells[ind]--;
        else this.cells[ind]++;

        this.cells[ind] = (this.cells[ind] % 6 + 6) % 6;

        let i = Math.floor(ind / this._width);
        let j = ind % this._width;

        const di = [0, 1, -1, 0, 0];
        const dj = [0, 0, 0, 1, -1];
        for (let k = 0; k < 5; ++k) {
            const ni = i + di[k];
            const nj = j + dj[k];

            if (ni < 0 || ni >= this._height || nj < 0 || nj >= this._width) continue;
            this.checkCell(ni * this._width + nj)
        }
    }

    getCellAt(x, y) {
        if (!this.getBoardBounds().collidePoint(x, y))
            return null;
        for (let i = 0; i < this._cell_count2; ++i) {
            let bounds = this.getBounds(i);
            if (bounds.collidePoint(x, y)) return i;
        }
        return null;
    }

    getBounds(ind) {
        let x = this._offsetx + this.getBorderSize() + (this.getMargin() + this.getCellSize()) * (ind % this._width);
        let y = this._offsety + this.getBorderSize() + (this.getMargin() + this.getCellSize()) * Math.floor(ind / this._width);
        return new Rect(x, y, this.getCellSize(), this.getCellSize());
    }

    getInnerBounds(ind) {
        let x = this._offsetx + this.getBorderSize() + (this.getMargin() + this.getCellSize()) * (ind % this._width);
        let y = this._offsety + this.getBorderSize() + (this.getMargin() + this.getCellSize()) * Math.floor(ind / this._width);
        let margin = this.getCellSize() / 5;
        return new Rect(x + margin, y + margin, this.getCellSize() - 2 * margin, this.getCellSize() - 2 * margin);
    }

    getBoardBounds() {
        return new Rect(this._offsetx, this._offsety, this.getTotalSize(), this.getTotalSize())
    }

    drawBoard(ctx) {
        Board.drawRect(ctx, this.borderColor, this.getBoardBounds());
        for (let i = 0; i < this._cell_count2; ++i) {
            let myColor;

            if (this.highlighted === i && !this.cellsValid[i])
                myColor = this.cellHighlightedInvalidColor;
            else if (this.highlighted === i)
                myColor = this.cellHighlightedColor;
            else if (!this.cellsValid[i])
                myColor = this.cellInvalidColor;
            else
                myColor = this.cellColor;
            
            Board.drawRect(ctx, myColor, this.getBounds(i));

            if (this.cells[i] !== cellstate.empty) {
                let myRect = this.getBounds(i);
                myRect.width -= this._cellmargin;
                myRect.height -= this._cellmargin;
                myColor = houseColors[this.cells[i]];
                Board.drawRect(ctx, myColor, this.getInnerBounds(i));
            }
        }
    }

    static drawRect(ctx, color, rect) {
        ctx.fillStyle = color;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
}
