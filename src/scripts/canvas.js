const canvas = (() => {
  const _load = (element) => {
    let ctx = element.getContext("2d");
    _style(canvas);
  };

  const _style = (canvas) => {
    canvas.style.border = "1px solid crimson";
    canvas.style.width = "100%";
    canvas.style.height = "60vw";
    canvas.style.maxHeight = "435px";
  };

  return {
    load: _load,
  };
})();

export default canvas;
