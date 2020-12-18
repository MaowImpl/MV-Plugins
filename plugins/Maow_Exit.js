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
 * @param   confirmExit
 * @type    boolean
 * @desc    Enable exit confirmation prompt.
 * @default true
 * 
 * @param   opacity
 * @parent  confirmExit
 * @type    number
 * @desc    The opacity of the exit confirmation prompt.
 * @default 128
 * 
 * @param   exitConfirmText
 * @parent  confirmExit
 * @desc    The text for the confirm button in the exit confirmation prompt.
 * @default Confirm
 * 
 * @param   exitCancelText
 * @parent  confirmExit
 * @desc    The text for the cancel button in the exit confirmation prompt.
 * @default Cancel
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

    var param_confirmExit = Boolean(params['confirmExit']);
    var param_opacity = Number(params['opacity']);
    var param_exitConfirmText = params['exitConfirmText'];
    var param_exitCancelText = params['exitCancelText'];

    // -----------------------
    //  Window_ConfirmExit
    // -----------------------

    function Window_ConfirmExit() {
        this.initialize.apply(this, arguments);
    }

    Window_ConfirmExit.prototype = Object.create(Window_Command.prototype);
    Window_ConfirmExit.prototype.constructor = Window_ConfirmExit;

    Window_ConfirmExit.prototype.initialize = function() {
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.updatePlacement();
        this.openness = 0;
        this.open();
    }

    Window_ConfirmExit.prototype.windowWidth = function() {
        return 240;
    }

    Window_ConfirmExit.prototype.updatePlacement = function() {
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = (Graphics.boxHeight - this.height) / 2;
    }

    Window_ConfirmExit.prototype.makeCommandList = function() {
        this.addCommand(param_exitConfirmText, 'confirm');
        this.addCommand(param_exitCancelText, 'cancel');
    }

    // -----------------------
    //  Scene_ConfirmExit
    // -----------------------

    function Scene_ConfirmExit() {
        this.initialize.apply(this, arguments);    
    }

    Scene_ConfirmExit.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_ConfirmExit.prototype.constructor = Scene_ConfirmExit;

    Scene_ConfirmExit.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    }

    Scene_ConfirmExit.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
    }

    Scene_ConfirmExit.prototype.stop = function() {
        Scene_MenuBase.prototype.stop.call(this);
        this._commandWindow.close();
    }

    Scene_ConfirmExit.prototype.createBackground = function() {
        Scene_MenuBase.prototype.createBackground.call(this);
        this.setBackgroundOpacity(param_opacity);
    }

    Scene_ConfirmExit.prototype.createCommandWindow = function() {
        this._commandWindow = new Window_ConfirmExit();
        this._commandWindow.setHandler('confirm', this.commandConfirm.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    }

    Scene_ConfirmExit.prototype.commandConfirm = function() {
        window.close();
    }

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
        if (param_confirmExit) {
            SceneManager.push(Scene_ConfirmExit);
            return;
        }
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
        if (param_confirmExit) {
            SceneManager.push(Scene_ConfirmExit);
            return;
        }
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