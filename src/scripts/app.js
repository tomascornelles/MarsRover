import map from "./map.js";
const roverApp = (() => {
  const _data = {
    size: 200,
    obstacles: 100,
    pixelSize: 16,
    orientation: 0,
    max: 0,
    map: [],
    manual: false,
  };
  const _messages = {
    hit: 'You find an obstacle',
    end: 'You find the limit of the planet',
    noland: 'You can not land in this place',
    manual: 'Manual control enabled\n\nYou can control de Rover whit the arrow keys',
    auto: 'Manual control disabled'
  }
  _data.center = {
    x: Math.round(_data.size / 2) + 15,
    y: Math.round(_data.size / 2) + 15,
  };
  _data.step = {
    x: Math.round(_data.size / 2) + 15,
    y: Math.round(_data.size / 2) + 15,
  };

  const _init = () => {
    console.log("init");
    // canvas.load()
    map.generate(_data);
    map.print(_data);
    window.addEventListener("keydown", (e) => {
      if (_data.manual) {
        if (e.which >= 37 && e.which <= 40) {
          e.preventDefault();
        }
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
        map.print(_data);
      }
    });
    document.querySelector(".js-manual").addEventListener("click", function () {
      if (this.className.indexOf("active") < 0) {
        this.classList.add("active");
        _data.manual = false;
        alert(_messages.auto)
      } else {
        this.classList.remove("active");
        _data.manual = true;
        alert(_messages.manual)
      }
      map.print(_data);
    });
    document
      .querySelector(".js-initial")
      .addEventListener("keypress", function (e) {
        if (e.which === 13) {
          let val = this.value.split(",");
          _data.step.x = 1 * val[0] + 15;
          _data.step.y = 1 * val[1] + 15;
          if (_checkCollision()) alert(_messages.noland);
          else map.print(_data);
        }
      });
    document
      .querySelector(".js-instructions")
      .addEventListener("keypress", function (e) {
        if (e.which === 13) {
          let steps = this.value.toUpperCase().split("");
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
              alert(_messages.hit);
              return false
            } else {
              map.print(_data);
              return true
            }
          });
        }
      });
    document.querySelector('.js-orientation').addEventListener('change', function () {
      _data.orientation = 1 * this.value
      map.print(_data)
    })
  }

  return {
    init: _init
  };
})();
roverApp.init();
