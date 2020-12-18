// ===================================
//  Maow_DynamicScreenSize.js
// ===================================

/*:
 * @author       Maow
 * @plugindesc   Modifies the size of the game window automatically based on the screen size of the player.
 *
 * @help
 * -----------------------------------
 *  Terms of Use
 * -----------------------------------
 * 1. Do not try to claim this as your own work.
 * 2. Attribution is not required, but it is preferred.
 * 3. Free-use for commercial and noncommercial projects.
 */

(function() {
    'use strict';
    
    // -----------------------
    //  SceneManager
    // -----------------------

    SceneManager._screenWidth = window.screen.width;
    SceneManager._screenHeight = window.screen.height;
})();