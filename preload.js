// renderer process, add this to battlereplayer so we can communicate with it
const { ipcRenderer }= require('electron');
ipcRenderer.on('copy', function (event,copyText) {
	var textarea = document.getElementById('code');
	textarea.value = copyText;
});