import get from "lodash/get";
// noinspection NpmUsedModulesInstalled
import {content} from "mindmup-mapjs-model";
import {ThemeProcessor} from "mindmup-mapjs-layout";
import themeProvider from "./theme";
import mapJS from "mindmup-mapjs";
import jQuery from "jquery";

console.log(content);

export function init(container, map) {
  const parentNodeMap = new Map(), colorMap = new Map(), foreGroundMap = new Map();
  const traverseNodes = function (obj, parent) {
    (Object.keys(obj.ideas || {})).forEach(key => {
      const item = obj.ideas[key];
      parentNodeMap.set(item.id, parent);
      const color = get(item, 'attr.style.background'),
        foreGround = get(item, 'attr.style.color');
      if (color) colorMap.set(item.id, color);
      if (foreGround) foreGroundMap.set(item.id, foreGround);
      traverseNodes(item, item.id)
    })
  };
  traverseNodes(map, undefined);
  console.log(parentNodeMap, colorMap);

  const mapModel = new mapJS.MapModel(mapJS.DOMRender.layoutCalculator, []);
  const outerContainer = jQuery(container);
  outerContainer.empty();
  const jqContainer = jQuery('<div></div>').appendTo(outerContainer);
  jqContainer.domMapWidget(console, mapModel);
  mapModel.setIdea(content(map));
  const stylesheet = new ThemeProcessor().process(themeProvider).css;
  jqContainer.append(`
<style>/*noinspection CssUnusedSymbol*/${stylesheet}.mapjs-link-hit {visibility: hidden;}
</style>`);
  jqContainer.focus();

  mapModel.addEventListener('nodeAttrChanged', e => {
    const color = get(e, 'attr.style.background'),
      foreGround = get(e, 'attr.style.color');
    if (color !== colorMap.get(e.id)) {
      colorMap.set(e.id, color);
      mapModel.dispatchEvent('colorChanged', e)
    }
    if (foreGround !== foreGroundMap.get(e.id)) {
      foreGroundMap.set(e.id, foreGround);
      mapModel.dispatchEvent('foreGroundChanged', e)
    }
    return false;
  });
  mapModel.addEventListener('nodeMoved', e => {
    const parentId = mapModel.getIdea().findParent(e.id).id;
    if (parentId !== parentNodeMap.get(e.id)) {
      parentNodeMap.set(e.id, parentId);
      mapModel.dispatchEvent('parentNodeChanged', e)
    }
    return false;
  });
  return mapModel;
}
