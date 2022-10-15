export default class Matrix {
    constructor() {
        this.grid = []
    }

    set(x, y, data) {
        if (!this.grid[x]) this.grid[x] = []

        this.grid[x][y] = data
    }

    get(x, y) {
        const column = this.grid[x]

        if (column) return column[y]

        return undefined
    }

    forEach(callback) {
        this.grid.forEach((column, x) => {
            column.forEach((data, y) => {
                callback(data, x, y)
            })
        })
    }

    delete(x, y) {
        const column = this.grid[x]

        if (column) delete column[y]
    }
}