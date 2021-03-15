const map = (() => {

  const _colors = ["transparent", "rgba(200,0,0,0.4)"];

  const _generate = (_data) => {
    console.log('Terraforming')
    _data.map = [];

    for (let a = 0; a < _data.size + 30; a++) {
      let row = [];
      for (let b = 0; b < _data.size + 30; b++) {
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
    _data.map = _normalize(_data.map, _data);
    for (let a = 0; a < _data.map.length; a++) {
      for (let b = 0; b < _data.map[a].length; b++) {
        if (a < 15 || a > _data.map.length - 15 || b < 15 || b > _data.map[a].length - 15)
          _data.map[a][b] = 1
      }
    }

    if (_checkCollision(_data)) _generate(_data);
    return _data.map
  };

  const _normalize = (map, _data) => {
    for (let a = 0; a < map.length; a++) {
      for (let b = 0; b < map[a].length; b++) {
        map[a][b] = Math.round(map[a][b] / _data.max);
      }
    }
    return map;
  };

  const _checkCollision = (_data) => _data.map[_data.step.y][_data.step.x] > 0;

  const _end = (_data) =>
    _data.step.x < 15 ||
    _data.step.y < 15 ||
    _data.step.x > _data.map.length - 15 ||
    _data.step.y > _data.map.length - 15;

  const _print = (_data) => {
    let pixelSize = _data.pixelSize;
    let canvas = document.createElement("canvas");
    canvas.classList.add("canvas");
    canvas.setAttribute("width", 480);
    canvas.setAttribute("height", 480);

    if (_end(_data)) {
      _data.step = { ..._data.center };
      alert(_messages.end);
    } else if (_checkCollision(_data)) {
      _data.step = { ..._data.center };
      alert(_messages.hit);
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
          for (
            let x = Math.round(_data.center.x - width / 2);
            x <= Math.round(_data.center.x + width / 2);
            x++
          ) {
            ctx.fillStyle = typeof map[x] !== 'undefinend' && typeof map[x][y] !== 'undefinend' ? _colors[map[y][x]] : _colors[1];
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

        ctx.font = "10px courier";
        ctx.fillText("+", (_data.center.x + 1 - offsetX) * pixelSize,
          (_data.center.y - 0.5 - offsetY) * pixelSize);
        ctx.fillText("+", (_data.center.x + 5 - offsetX) * pixelSize,
          (_data.center.y - 2 - offsetY) * pixelSize);
        ctx.fillText("+", (_data.center.x + 5 - offsetX) * pixelSize,
          (_data.center.y - 0.5 - offsetY) * pixelSize);
        ctx.fillText("+", (_data.center.x + 1 - offsetX) * pixelSize,
          (_data.center.y - 2 - offsetY) * pixelSize);
        ctx.fillText("rover", (_data.center.x + 1.5 - offsetX) * pixelSize,
          (_data.center.y - 1.5 - offsetY) * pixelSize);
        ctx.fillText((_data.step.x - 15) + ", " + (_data.step.y - 15), (_data.center.x + 1.5 - offsetX) * pixelSize,
          (_data.center.y - 1 - offsetY) * pixelSize);

        ctx.rotate(or[_data.orientation])
        ctx.font = "16px Arial";
        ctx.fillText("▲", (_data.center.x - offsetX) * pixelSize,
          (_data.center.y - 0.1 - offsetY) * pixelSize);
      }

      document.querySelector("#map").innerHTML = "";
      document.querySelector("#map").append(canvas);

      _updateFields(_data)
    }
  };

  const _random = (n) => Math.round(Math.random() * (n || 1));

  const _updateFields = (_data) => {
    document.querySelector('.js-initial').value = `${_data.center.x - 15},${_data.center.y - 15}`
    document.querySelector('.js-orientation').value = _data.orientation
    document.querySelector('.js-instructions').value = ''
  }

  return {
    generate: _generate,
    print: _print,
    checkCollision: _checkCollision,
  };
})();

export default map;
