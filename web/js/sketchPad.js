class SketchPad {
  constructor(container, size = 400) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style = `
      background-color: white;
      box-shadow: 0px 0px 10px 2px black;
    `;

    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.reset();

    this.undoBtn = document.getElementById("undo");

    this.#addEventListeners();
  }

  reset() {
    this.paths = [];
    this.isDrawing = false;
    this.#redraw();
  }

  #addEventListeners() {
    this.canvas.onmousedown = (e) => {
      const mouse = this.#getMouse(e);
      this.paths.push([mouse]);
      this.isDrawing = true;
    };

    this.canvas.onmousemove = (e) => {
      if (this.isDrawing) {
        const mouse = this.#getMouse(e);
        this.paths[this.paths.length - 1].push(mouse);
        this.#redraw();
      }
    };

    document.onmouseup = () => {
      this.isDrawing = false;
    };

    this.canvas.ontouchstart = (e) => {
      this.canvas.onmousedown(e.touches[0]);
    };

    this.canvas.ontouchmove = (e) => {
      this.canvas.onmousemove(e.touches[0]);
    };

    document.ontouchend = () => {
      document.onmouseup();
    };

    this.undoBtn.onclick = () => {
      if (this.paths.length) {
        this.paths.pop();
        this.#redraw();
      }
    };
  }

  #getMouse = (e) => {
    const rect = this.canvas.getBoundingClientRect();
    return [
      Math.round(e.clientX - rect.left),
      Math.round(e.clientY - rect.top),
    ];
  };

  #redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    draw.paths(this.ctx, this.paths);
  }
}

const sketchPad = new SketchPad(document.getElementById("sketchPadContainer"));
