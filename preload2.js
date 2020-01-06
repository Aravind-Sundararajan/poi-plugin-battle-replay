// renderer process, add this to battlereplayer so we can communicate with it
const { ipcRenderer }= require('electron');

var observer = new MutationObserver(function(mutations) {
 var img = document.getElementsByTagName("img")[0];
 if (document.contains(img)) {
  if (img.src){
  console.log("it was added to the DOM!");
  console.log(img.src)
  ipcRenderer.sendToHost('updateImage', img.src);
  var removeBtn = document.getElementsByClassName('pure-button remove-button')[0];
  removeBtn.dispatchEvent(new Event('click'));
  observer.disconnect();
  }
 }
});
observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

 
  
   ipcRenderer.on('copy', function (event,copyText) { 
    var textarea = document.querySelectorAll("textarea.pure-input-1"); 
    var convertButton = document.getElementById("convertData"); 
    textarea[0].value = copyText;
    textarea[0].dispatchEvent(new Event('change'));
    convertButton.dispatchEvent(new Event('click'));
    ipcRenderer.sendToHost('copy');
    console.log("sending copy callback to host");
    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
   });
   
   


/*    if (mutation.type === 'attributes'){
    var img = document.getElementsByTagName("img")[0];
    try{    
    console.log(img.src);
    
    }
    catch(err){console.log(err);}
    
   } */

/*    ipcRenderer.on('updateImage',function (event) {
    
    try{    console.log(img.src);}
    catch(err){console.log(err);}
    
   }); */
    
   
/* window.onload = function() {
 var script = document.createElement("script");
 script.src = "https://code.jquery.com/jquery-2.1.4.min.js";
 script.onload = script.onreadystatechange = function() {
  $(document).ready(function () {
   $("img").on('load', function(){
   console.log($("img").attr('src'));
   ipcRenderer.sendToHost('img', $("img").attr('src'));
   });
  });
 }
} */