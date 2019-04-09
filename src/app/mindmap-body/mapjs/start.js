/*global require, document, window, console */
import get from "lodash/get";

// import testMap from "./example-map";
import themeProvider from "./theme";
import jQuery from "@mindmup/mapjs/node_modules/jquery";
import MAPJS from "@mindmup/mapjs";

const content = MAPJS.content,
  init = function (_container, map) {
    'use strict';
    let domMapController;
    const container = jQuery(_container);
    container.empty();
    const idea = content(map),
      touchEnabled = false,
      mapModel = new MAPJS.MapModel([]),
      layoutThemeStyle = function (themeJson) {
        const themeCSS = themeJson && new MAPJS.ThemeProcessor().process(themeJson).css;
        if (!themeCSS) {
          return false;
        }

        if (!window.themeCSS) {
          jQuery('<style id="themeCSS" type="text/css"></style>').appendTo('head').text(themeCSS);
        }
        return true;
      },
      themeJson = themeProvider.default || MAPJS.defaultTheme,
      theme = new MAPJS.Theme(themeJson),
      getTheme = () => theme;

    container.domMapWidget(console, mapModel, touchEnabled);
    // container.append('<style id="themecss"></style>');

    domMapController = new MAPJS.DomMapController(
      mapModel,
      container.find('[data-mapjs-role=stage]'),
      touchEnabled,
      undefined, // resourceTranslator
      getTheme
    );
    // jQuery('#themecss').themeCssWidget(themeProvider, new MAPJS.ThemeProcessor(), mapModel, domMapController);
    // activityLog, mapModel, touchEnabled, imageInsertController, dragContainer, centerSelectedNodeOnOrientationChange

    // jQuery('body').attachmentEditorWidget(mapModel);
    layoutThemeStyle(themeJson);
    mapModel.setIdea(idea);

    const stylesheet = new MAPJS.ThemeProcessor().process(themeProvider).css;
    container.append(`
<style>/*noinspection CssUnusedSymbol*/${stylesheet}.mapjs-link-hit {visibility: hidden;}
</style>`);

    return mapModel
  };

export {init}
