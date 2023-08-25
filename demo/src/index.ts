import { City, CityGenerationMode, NodeType } from "../../src/index";
import { randomRange } from "../../src/utils";
import { ui } from "./interface";

const ctx = ui.screen.getContext("2d") as CanvasRenderingContext2D;
const tileSize = 4;

function generateAndRenderCity() {
  // PREPARE

  const city = new City({
    width: Number(ui.inputs.worldWidth?.value),
    height: Number(ui.inputs.worldHeight?.value),
  });

  ui.screen.width = city.width * tileSize;
  ui.screen.height = city.height * tileSize;
  ctx.lineWidth = tileSize;
  ctx.textAlign = "center";

  // DRAW

  function drawPaths() {
    ctx.clearRect(0, 0, ui.screen.width, ui.screen.height);

    city.getAllPaths().forEach((path) => {
      const points = path.getPoints();

      ctx.beginPath();
      ctx.moveTo(
        points.beg.x * tileSize + tileSize / 2,
        points.beg.y * tileSize + tileSize / 2
      );
      ctx.lineTo(
        points.end.x * tileSize + tileSize / 2,
        points.end.y * tileSize + tileSize / 2
      );
      ctx.stroke();
    });
  }

  function drawBuildings() {
    city.getAllBuildings().forEach((building) => {
      const ton = 100 + randomRange(0, 5) * 10;

      ctx.fillStyle = `rgba(${ton}, ${ton}, ${ton})`;
      ctx.fillRect(
        building.position.x * tileSize,
        building.position.y * tileSize,
        building.width * tileSize,
        building.height * tileSize
      );
    });
  }

  function drawNodes() {
    city.getAllNodes().forEach((node) => {
      switch (node.getType()) {
        case NodeType.CROSS: {
          ctx.fillStyle = "red";
          break;
        }
        case NodeType.TURN: {
          ctx.fillStyle = "orange";
          break;
        }
        case NodeType.END: {
          ctx.fillStyle = "blue";
          break;
        }
      }
      ctx.fillRect(
        node.position.x * tileSize,
        node.position.y * tileSize,
        tileSize,
        tileSize
      );
    });
  }

  // GENERATE

  city
    .generate({
      mode: ui.inputs.seedMode?.checked
        ? CityGenerationMode.SEED
        : CityGenerationMode.RUNTIME,
      streetMinLength: Number(ui.inputs.streetMinLength?.value),
      buildingMinSize: Number(ui.inputs.buildingMinSize?.value),
      buildingMaxSize: Number(ui.inputs.buildingMaxSize?.value),
      buildingMinSpace: Number(ui.inputs.buildingMinSpace?.value),
      buildingMaxSpace: Number(ui.inputs.buildingMaxSpace?.value),
      probabilityIntersection: Number(ui.inputs.probabilityIntersection?.value),
      probabilityTurn: Number(ui.inputs.probabilityTurn?.value),
      probabilityStreetEnd: Number(ui.inputs.probabilityStreetEnd?.value),
    })
    .then(() => {
      if (ui.inputs.seedMode?.checked) {
        console.log("SEED =", city.getSeed());
      }

      drawPaths();
      drawBuildings();

      if (ui.inputs.nodeDisplay?.checked) {
        drawNodes();
      }
    });
}

ui.buttons.generate?.addEventListener("click", generateAndRenderCity);
generateAndRenderCity();
