const canvas = (() => {
  const _load = () => {
    let canvas = document.createElement('canvas')
    canvas.classList.add('canvas')
    document.querySelector('#map').append(canvas)
    let ctx = canvas.getContext("2d");
  };


  return {
    load: _load,
  };
})();

export default canvas;
