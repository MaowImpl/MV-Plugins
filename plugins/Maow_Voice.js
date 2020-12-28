// ===================================
//  Maow_Voice.js
// ===================================

/*:
 * @author       Maow
 * @plugindesc   Microphone utilities.
 * 
 * @param silenceMax
 * @type number
 * @desc Declares the maximum value that 'silence' can be at. 8 is typically below human speaking levels.
 * @default 8
 * 
 * @help
 * -----------------------------------
 *  Terms of Use
 * -----------------------------------
 * 1. Do not try to claim this as your own work.
 * 2. Attribution is not required, but it is preferred.
 * 3. Free-use for commercial and noncommercial projects.
 * -----------------------------------
 *  Calls
 * -----------------------------------
 * Voice.getAverageVolume() - Gets the average volume (float) from the microphone if possible.
 * Voice.isSilent() - Detects if the player is not speaking.
 * -----------------------------------
 *  Notes
 * -----------------------------------
 * A good value for speaking would be 90 or above.
 * Whispering is typically 15 to 40, however, certain sharp sounds (such as a T or S) or background noise can be louder than 90.
 * These values will likely be different for most people, depending on microphone quality to the position of the microphone.
 * If you are using this to detect when a player is speaking, it is recommended to inform the players near the start of your game to move their microphone to a better position.
 */

var Voice = Voice || {};

(function() {
	'use strict';

	const params = PluginManager.parameters('Maow_Voice');
	const param_silenceMax = Number(params['silenceMax']);

	const context = new (window.AudioContext || window.webkitAudioContext)();
	const analyser = createAnalyser(context);
	const buffer = new Uint8Array(analyser.frequencyBinCount);

	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			const source = context.createMediaStreamSource(stream);
			source.connect(analyser);	
		});
	}

	// -----------------------
	//  Calls
	// -----------------------

	Voice.getAverageVolume = function() {
		if (analyser) {
			analyser.getByteFrequencyData(buffer);
			return getAverageVolume(buffer);
		}
	}

	Voice.isSilent = function() {
		if (analyser) {
			analyser.getByteFrequencyData(buffer);
			const volume = getAverageVolume(buffer);
			return volume >= 0 && volume <= param_silenceMax;
		}
	}

	// -----------------------
	//  Utils
	// -----------------------

	function createAnalyser(context) {
		const analyser = context.createAnalyser();
		analyser.fftSize = 1024;
		// analyser.minDecibels = -127;
		// analyser.maxDecibels = 0;
		analyser.smoothingTimeConstant = 0.3;
		return analyser;
	}

	function getAverageVolume(buffer) {
		let sum = 0;
		const length = buffer.length;
		for (const value of buffer) {
			sum += value;
		}
		return sum / length;
	}
})();