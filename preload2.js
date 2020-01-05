// renderer process, add this to battlereplayer so we can communicate with it
const { ipcRenderer }= require('electron');
ipcRenderer.on('genImage', function (event,copyText) {
	const pasteDataContainer = $("#paste-data-container");
	var textarea = document.getElementById('code');
	textarea.value = copyText;
});
