// ===================================
//  Maow_DefaultFullscreen.js
// ===================================

/*:
 * @author       Maow
 * @plugindesc   Makes the game always boot in fullscreen mode.
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
	
	var _SceneManager_run = SceneManager.run;
	SceneManager.run = function(sceneClass) { 
		_SceneManager_run.call(this, sceneClass); 
		Graphics._switchFullScreen()
	};
})();
