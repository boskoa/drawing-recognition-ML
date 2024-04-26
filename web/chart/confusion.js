class Confusion {
  constructor(container, samples, classes, options) {
    this.samples = samples;
    this.classes = classes;
    this.size = options.size;
    this.styles = options.styles;

    this.N = classes.length + 1;
    this.cellSize = this.size / (this.N + 1);
    this.table = document.createElement("table");
    this.table.style.borderCollapse = "collapse";
    this.table.style.textAlign = "center";
    this.table.style.marginLeft = this.cellSize + "px";
    this.table.style.marginTop = this.cellSize + "px";

    container.appendChild(this.table);

    const topText = document.createElement("div");
    topText.innerText = "Predicted Class";
    topText.style.position = "absolute";
    topText.style.fontSize = "x-large";
    topText.style.top = "0px";
    topText.style.left = "50%";
    topText.style.transform = "translateX(-50%)";
    topText.style.height = this.cellSize + "px";
    topText.style.display = "flex";
    topText.style.alignItems = "center";
    container.appendChild(topText);

    const leftText = document.createElement("div");
    leftText.innerText = "True Class";
    leftText.style.position = "absolute";
    leftText.style.fontSize = "x-large";
    leftText.style.left = "0px";
    leftText.style.top = "50%";
    leftText.style.transform = "translateY(-50%) rotateZ(180deg)";
    leftText.style.transformOrigin = "center";
    leftText.style.width = this.cellSize + "px";
    leftText.style.display = "flex";
    leftText.style.alignItems = "center";
    leftText.style.writingMode = "vertical-rl";
    container.appendChild(leftText);

    this.matrix = this.#prepareMatrix(samples);
    this.#fillTable();
  }

  #prepareMatrix(samples) {
    const mat = [];
    for (let i = 0; i < this.N; i++) {
      mat[i] = Array(this.N).fill(0);
    }

    for (const s of samples) {
      mat[this.classes.indexOf(s.truth) + 1][
        this.classes.indexOf(s.label) + 1
      ]++;
    }

    for (let i = 1; i < this.N; i++) {
      for (let j = 1; j < this.N; j++) {
        mat[0][j] += mat[i][j];
        mat[i][0] += mat[i][j];
      }
    }

    for (let i = 1; i < this.N; i++) {
      mat[0][i] -= mat[i][0];
    }

    return mat;
  }

  #fillTable() {
    const { N, matrix, styles, classes, cellSize, table } = this;

    for (let i = 0; i < N; i++) {
      const row = document.createElement("tr");
      table.appendChild(row);

      for (let j = 0; j < N; j++) {
        const cell = document.createElement("td");
        cell.style.width = cellSize + "px";
        cell.style.height = cellSize + "px";
        cell.style.padding = "0px";
        cell.textContent = matrix[i][j];

        row.appendChild(cell);
      }
    }
  }
}
