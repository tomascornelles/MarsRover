import canvas from "./canvas.js";
const roverApp = (() => {
  let _data = {
    size: 200,
    obstacles: 200,
    pixelSize: 16,
    orientation: 0,
    max: 0,
    map: [],
    manual: false,
  };
  _data.center = {
    x: Math.round(_data.size / 2),
    y: Math.round(_data.size / 2),
  };
  _data.step = {
    x: Math.round(_data.size / 2),
    y: Math.round(_data.size / 2),
  };

  const _colors = ["transparent", "rgba(200,0,0,0.4)"];

  const _init = () => {
    console.log("init");
    // canvas.load()
    _generateMap();
    if (_checkCollision()) _init();
    else _printMap(_data.size / 2, _data.size / 2);
    window.addEventListener("keydown", (e) => {
      if (_data.manual) {
        if (e.which >= 37 && e.which <= 40) {
          e.preventDefault();
        }
        console.log(e.which);
        if (e.which === 39) { _data.orientation = (_data.orientation === 3) ? 0 : _data.orientation + 1 }
        else if (e.which === 37) { _data.orientation = (_data.orientation === 0) ? 3 : _data.orientation - 1 }
        else if (e.which === 38) {
          if (_data.orientation === 0)
            _data.step.y = _data.step.y - 1;
          else if (_data.orientation === 1)
            _data.step.x = _data.step.x + 1;
          else if (_data.orientation === 2)
            _data.step.y = _data.step.y + 1;
          else if (_data.orientation === 3)
            _data.step.x = _data.step.x - 1;
        }
        _printMap();
      }
    });
    document.querySelector(".js-manual").addEventListener("click", function () {
      if (this.className.indexOf("active") < 0) {
        console.log("Pasando a modo manual");
        this.classList.add("active");
        _data.manual = true;
      } else {
        console.log("Pasando a ruta");
        this.classList.remove("active");
        _data.manual = false;
      }
      _printMap();
    });
    document
      .querySelector(".js-initial")
      .addEventListener("keypress", function (e) {
        if (e.which === 13) {
          let val = this.value.split(",");
          _data.step.x = 1 * val[0];
          _data.step.y = 1 * val[1];
          if (_checkCollision()) alert("No es posible aterrizar en ese punto");
          else _printMap();
        }
      });
    document
      .querySelector(".js-instructions")
      .addEventListener("keypress", function (e) {
        if (e.which === 13) {
          let steps = this.value.toUpperCase().split("");
          console.log(steps);
          steps.every((step) => {
            if (step === "F") {
              if (_data.orientation === 0)
                _data.step.y = _data.step.y - 1;
              else if (_data.orientation === 1)
                _data.step.x = _data.step.x + 1;
              else if (_data.orientation === 2)
                _data.step.y = _data.step.y + 1;
              else if (_data.orientation === 3)
                _data.step.x = _data.step.x - 1;
            }
            if (step === "L") {
              _data.orientation = (_data.orientation === 0) ? 3 : _data.orientation - 1
            }
            if (step === "R") {
              _data.orientation = (_data.orientation === 3) ? 0 : _data.orientation + 1
            }

            if (_checkCollision()) {
              alert("Ha encontrado un obstáculo");
              return false
            } else {
              _printMap();
              return true
            }
          });
        }
      });
    document.querySelector('.js-orientation').addEventListener('change', function () {
      _data.orientation = 1 * this.value
      _printMap()
    })
  };

  const _updateFields = () => {
    document.querySelector('.js-initial').value = `${_data.center.x},${_data.center.y}`
    document.querySelector('.js-orientation').value = _data.orientation
    document.querySelector('.js-instructions').value = ''
  }

  const _random = (n) => Math.round(Math.random() * (n || 1));

  const _generateMap = () => {
    _data.map = [];

    for (let a = 0; a < _data.size; a++) {
      let row = [];
      for (let b = 0; b < _data.size; b++) {
        row.push(0);
      }
      _data.map.push(row);
    }
    for (let c = 0; c < _data.obstacles; c++) {
      let sphere = {
        x: _random(_data.size) || 0,
        y: _random(_data.size) || 0,
        r: _random(_data.size / 10) || 0,
      };
      for (let a = -sphere.r; a <= sphere.r; a++) {
        for (let b = -sphere.r; b <= sphere.r; b++) {
          let h = Math.round((sphere.r ** 2 - b ** 2 - a ** 2) ** (1 / 2));
          if (
            sphere.y + a >= 0 &&
            sphere.x + b >= 0 &&
            h >= 0 &&
            typeof _data.map[sphere.y + a] !== "undefined" &&
            typeof _data.map[sphere.y + a][sphere.x + b] !== "undefined"
          ) {
            _data.map[sphere.y + a][sphere.x + b] += h;
            _data.max =
              _data.max < _data.map[sphere.y + a][sphere.x + b]
                ? _data.map[sphere.y + a][sphere.x + b]
                : _data.max;
          }
        }
      }
    }
    _data.map = _normalizeMap(_data.map);
  };

  const _normalizeMap = (map) => {
    for (let a = 0; a < map.length; a++) {
      for (let b = 0; b < map[a].length; b++) {
        map[a][b] = Math.round(map[a][b] / _data.max);
      }
    }
    return map;
  };

  const _checkCollision = () => _data.map[_data.step.y][_data.step.x] > 0;

  const _endMap = () =>
    _data.step.x < 15 ||
    _data.step.y < 15 ||
    _data.step.x > _data.size - 15 ||
    _data.step.y > _data.size - 15;

  const _printMap = () => {
    let pixelSize = _data.pixelSize;
    let canvas = document.createElement("canvas");
    canvas.classList.add("canvas");
    canvas.setAttribute("width", 480);
    canvas.setAttribute("height", 480);

    if (_endMap()) {
      _data.step = { ..._data.center };
      alert("Se ha alcanzado el límite del planeta");
    } else if (_checkCollision()) {
      _data.step = { ..._data.center };
      alert("Ha chocado contra un muro\nHa chocado contra un muro");
    } else {
      if (canvas.getContext) {
        _data.center = { ..._data.step };
        let width = Math.round(canvas.width / pixelSize);
        let height = width;
        let map = _data.map;
        let offsetX = Math.round(_data.center.x - canvas.width / pixelSize / 2);
        let offsetY = Math.round(_data.center.y - canvas.width / pixelSize / 2);
        let ctx = canvas.getContext("2d");
        for (
          let y = Math.round(_data.center.y - height / 2);
          y <= Math.round(_data.center.y + height / 2);
          y++
        ) {
          let row = map[y];
          for (
            let x = Math.round(_data.center.x - width / 2);
            x <= Math.round(_data.center.x + width / 2);
            x++
          ) {
            ctx.fillStyle = _colors[map[y][x]];
            ctx.fillRect(
              (x - 0.5 - offsetX) * pixelSize,
              (y - 0.5 - offsetY) * pixelSize,
              pixelSize,
              pixelSize
            );

            ctx.beginPath();
            ctx.setLineDash([4, 2]);
            ctx.strokeStyle = "rgba(200,0,0,0.5)";
            ctx.lineCap = "butt";
            ctx.lineWidth = 1;
            ctx.moveTo(
              (x - 0.5 - offsetX) * pixelSize - 0.5,
              (y - 0.5 - offsetY) * pixelSize - 0.5
            );
            ctx.lineTo(
              (x - 0.5 - offsetX) * pixelSize - 0.5,
              (y - 0.5 - offsetY + 1) * pixelSize - 0.5
            );
            ctx.stroke();
            ctx.beginPath();
            ctx.setLineDash([4, 2]);
            ctx.strokeStyle = "rgba(200,0,0,0.5)";
            ctx.lineCap = "butt";
            ctx.lineWidth = 1;
            ctx.moveTo(
              (x - 0.5 - offsetX) * pixelSize - 0.5,
              (y - 0.5 - offsetY) * pixelSize - 0.5
            );
            ctx.lineTo(
              (x - 0.5 - offsetX + 1) * pixelSize - 0.5,
              (y - 0.5 - offsetY) * pixelSize - 0.5
            );
            ctx.stroke();
          }
        }

        const or = [0, Math.PI / 2, Math.PI, -Math.PI / 2]
        ctx.fillStyle = "crimson";
        if (_data.orientation === 0) {
          ctx.translate((_data.center.x - 15.5 - offsetX) * pixelSize,
            (_data.center.y - 14.5 - offsetY) * pixelSize)
        }
        if (_data.orientation === 1) {
          ctx.translate((_data.center.x + 14.5 - offsetX) * pixelSize,
            (_data.center.y - 15.5 - offsetY) * pixelSize)
        }
        if (_data.orientation === 2) {
          ctx.translate((_data.center.x + 15.5 - offsetX) * pixelSize,
            (_data.center.y + 14.5 - offsetY) * pixelSize)
        }
        if (_data.orientation === 3) {
          ctx.translate((_data.center.x - 14.5 - offsetX) * pixelSize,
            (_data.center.y + 15.5 - offsetY) * pixelSize)
        }
        ctx.rotate(or[_data.orientation])
        ctx.font = "16px Arial";
        ctx.fillText("▲", (_data.center.x - offsetX) * pixelSize,
          (_data.center.y - 0.1 - offsetY) * pixelSize);
      }
      document.querySelector("#map").innerHTML = "";
      document.querySelector("#map").append(canvas);

      _updateFields()
    }
  };

  return {
    init: _init,
    printMap: _printMap,
  };
})();
roverApp.init();
