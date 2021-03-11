import canvas from './canvas.js'
const roverApp = (() => {
  const _init = () => {
    console.log('init')
    // canvas.load()
    _generateMap()
  };

  const _random = (n) => Math.round(Math.random() * (n || 1))

  const _data = {
    size: 200,
    obstacles: 50,
    pixelSize: 16,
    max: 0,
    map: []
  }

  const _colors = ['transparent', 'grey']

  const _generateMap = () => {
    _data.map = []

    for (let a = 0; a < _data.size; a++) {
      let row = []
      for (let b = 0; b < _data.size; b++) {
        row.push(0)
      }
      _data.map.push(row)
    }
    for (let c = 0; c < _data.obstacles; c++) {
      let sphere = {
        x: _random(_data.size) || 0,
        y: _random(_data.size) || 0,
        r: _random(_data.size / 4) || 0
      }
      for (let a = (-sphere.r); a <= (sphere.r); a++) {
        for (let b = (- sphere.r); b <= (sphere.r); b++) {
          let h = Math.round((sphere.r ** 2 - b ** 2 - a ** 2) ** (1 / 2))
          if (sphere.y + a >= 0
            && sphere.x + b >= 0
            && h >= 0
            && typeof _data.map[sphere.y + a] !== 'undefined'
            && typeof _data.map[sphere.y + a][sphere.x + b] !== 'undefined') {
            _data.map[sphere.y + a][sphere.x + b] += h
            _data.max = (_data.max < _data.map[sphere.y + a][sphere.x + b])
              ? _data.map[sphere.y + a][sphere.x + b]
              : _data.max
          }
        }
      }
    }
    _data.map = _normalizeMap(_data.map)
    _printMap(_data.size / 2, _data.size / 2)
  }

  const _normalizeMap = (map) => {
    for (let a = 0; a < map.length; a++) {
      for (let b = 0; b < map[a].length; b++) {
        map[a][b] = Math.round(map[a][b] / _data.max)
      }
    }
    return map
  }

  const _printMap = (centerX, centerY) => {
    let canvas = document.createElement('canvas');
    canvas.classList.add('canvas')
    canvas.setAttribute("width", window.innerWidth - 40);
    canvas.setAttribute("height", 400);

    if (canvas.getContext) {
      let map = _data.map
      let pixelSize = _data.pixelSize

      let ctx = canvas.getContext('2d');
      for (let y = centerY; y < map.length; y++) {
        let row = map[y]
        for (let x = centerX; x < row.length; x++) {
          ctx.fillStyle = _colors[map[y][x]]
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)

          ctx.beginPath();
          ctx.strokeStyle = "crimson";
          ctx.lineCap = "butt"
          ctx.lineWidth = _data.dimension - _data.size;
          ctx.moveTo(x * pixelSize, y * pixelSize);
          ctx.lineTo(x * pixelSize, (y + 1) * pixelSize);
          ctx.stroke();
          ctx.beginPath();
          ctx.strokeStyle = "crimson";
          ctx.lineCap = "butt"
          ctx.lineWidth = _data.dimension - _data.size;
          ctx.moveTo(x * pixelSize, y * pixelSize);
          ctx.lineTo((x + 1) * pixelSize, y * pixelSize);
          ctx.stroke();
        }
      }


      document.querySelector('#map').innerHTML = ''
      document.querySelector('#map').append(canvas)


    }
  }

  return {
    init: _init,
  };
})();
roverApp.init()