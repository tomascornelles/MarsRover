import { expect, test } from "@jest/globals";
import canvas from "./canvas.js";

test("canvas loaded", () => {
  document.body.innerHTML = '<canvas id="mars"></canvas>';
  expect(canvas.load(document.getElementById("mars"))).toBeDefined();
});
