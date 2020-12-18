// ===================================
//  Maow_Exit.js
// ===================================

/*:
 * @author       Maow
 * @plugindesc   Adds an Exit button to the title screen and in-game menu.
 *
 * @param   titleExitName
 * @desc    Name of the exit button on the title screen.
 * @default Exit
 * 
 * @param   menuExitName
 * @desc    Name of the exit button in the in-game menu.
 * @default To Desktop
 * 
 * @help
 * -----------------------------------
 *  Terms of Use
 * -----------------------------------
 * 1. Do not try to claim this as your own work.
 * 2. Attribution is not required, but it is preferred.
 * 3. Free-use for commercial and noncommercial projects.
 * -----------------------------------
 *  Incompatibility Notice
 * -----------------------------------
 * This plugin will inevitably be incompatible with other plugins that modify the title screen/game end menu.
 * These include plugins like Title Command Customizer by SumRndmDde.
 */

(function() {
    'use strict';

    var params = PluginManager.parameters('Maow_Exit');
    var param_titleExitName = params['titleExitName'];
    var param_menuExitName = params['menuExitName'];

    // -----------------------
    //  Window_TitleCommand
    // -----------------------

    var _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.call(this);
        this.addCommand(param_titleExitName, 'exit');
    }

    // -----------------------
    //  Scene_Title
    // -----------------------

    Scene_Title.prototype.commandExit = function() {
        window.close();
    }

    Scene_Title.prototype.createCommandWindow = function() {
        this._commandWindow = new Window_TitleCommand();
        this._commandWindow.setHandler('newGame', this.commandNewGame.bind(this));
        this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
        this._commandWindow.setHandler('options', this.commandOptions.bind(this));
        this._commandWindow.setHandler('exit', this.commandExit.bind(this));
        this.addWindow(this._commandWindow);
    }

    // -----------------------
    //  Window_GameEnd
    // -----------------------

    Window_GameEnd.prototype.makeCommandList = function() {
        this.addCommand(TextManager.toTitle, 'toTitle');
        this.addCommand(param_menuExitName, 'toDesktop');
        this.addCommand(TextManager.cancel,  'cancel');
    }

    // -----------------------
    //  Scene_GameEnd
    // -----------------------

    Scene_GameEnd.prototype.commandToDesktop = function() {
        window.close();    
    }

    Scene_GameEnd.prototype.createCommandWindow = function() {
        this._commandWindow = new Window_GameEnd();
        this._commandWindow.setHandler('toTitle', this.commandToTitle.bind(this));
        this._commandWindow.setHandler('toDesktop', this.commandToDesktop.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    }
})();