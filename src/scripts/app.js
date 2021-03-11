import canvas from './canvas.js'
const roverApp = (() => {
  const _init = () => {
    console.log('init')
    let mars = document.getElementById("mars");
    canvas.load(mars)
    return 'init'
  };

  return {
    init: _init,
  };
})();
export default roverApp;
