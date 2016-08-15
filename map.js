var request;
var passw="";
var passwCorrect=false;

var pictH = 71, 
			pictW = 96, 
			pictInRow = 20,
			pictInCol = 20;
map.style.left="0px";
map.style.top="0px";
map.style.zoom = "100%";
initMap();
drawMap();
var mapEditing = false;
var mouseIsDown = false;
map.addEventListener("mousemove", function(ev) {
	if(mouseIsDown&&!mapEditing){
	    map.style.left=ev.clientX+startX+"px"; // Перемещение карты
	    map.style.top=ev.clientY+startY+"px";
	}
	if(mouseIsDown&&mapEditing){
		rect.style.height = Math.abs(parseInt(rect.style.top)-parseInt(ev.clientY))+"px"; // Редактирование
		rect.style.width = Math.abs(parseInt(rect.style.left)-parseInt(ev.clientX))+"px";
	}
}, false);
    map.addEventListener("mousedown", function(ev) {
	mouseIsDown=true;
	if(!mapEditing){
	    startX=-ev.clientX+parseInt(map.style.left); // Перемещение карты
	    startY=-ev.clientY+parseInt(map.style.top);
	}else{
		if(mapEditing&&passwCorrect){
			objForm.style.display="none";
			rect.style.display ="block";
			rect.style.top = parseInt(ev.clientY)+"px";
			rect.style.left = parseInt(ev.clientX)+"px";
			rect.style.height = "0px";
			rect.style.width = "0px";
		}
	}
	  }, false);
	map.addEventListener("mouseup", function(ev) {
	    mouseIsDown=false;
	    drawMap();
	    if(mapEditing&&passwCorrect){ // редактирование
	    	objForm.style.display="block";
			objForm.style.top = rect.style.top;
			objForm.style.left = rect.style.left;
			objTitle.focus();
			
			objTitle.style.top = rect.style.top;
			objTitle.style.left = rect.style.left;
			objTitle.style.height =rect.style.height;
			objTitle.style.width = rect.style.width;

			objSubmit.onclick = function (){
				var div = document.createElement('div');

				var a = document.createElement('a'); // Добавление элемента
				a.href = objHref.value;
				a.innerText = objTitle.value;
				a.target="_top";
				
				div.style.top = parseInt(rect.style.top)-parseInt(map.style.top)+"px";
				div.style.left = parseInt(rect.style.left)-parseInt(map.style.left)+"px";
				div.style.height =rect.style.height;
				div.style.width = rect.style.width;

				div.appendChild(a);
				mapObj.appendChild(div);

				addObject(div.outerHTML); // Отправка данных на сервер
	
				objForm.style.display="none";
				rect.style.display ="none";

				objTitle.value = "";
				objHref.value = "";
			}
		}
	  }, false);


function initMap() { // Первоначальная отрисовка карты
	for(var i=0;i<pictInRow*pictInCol;i++){
				var div = document.createElement('div');
			    div.style.background = "url('default.jpg')";
			    div.style.top = parseInt((i)/pictInRow)*pictH;
			    div.style.left = ((i)%pictInRow)*pictW;
			    map.appendChild(div);

	}
	var nav = document.createElement('nav');
		nav.id = "mapObj";
		map.appendChild(nav);	
}

// Отрисовка карты
function drawMap(){
	var leftBorder = parseInt(Math.abs(parseInt(map.style.left))/(pictW*parseInt(map.style.zoom)*0.01)); 
	var rightBorder = parseInt((document.documentElement.clientWidth + Math.abs(parseInt(map.style.left)))/(pictW*parseInt(map.style.zoom)*0.01));
	var startingRow = parseInt(Math.abs(parseInt(map.style.top))/(pictH*parseInt(map.style.zoom)*0.01));
	var endRow = parseInt((document.documentElement.clientHeight + Math.abs(parseInt(map.style.top)))/(pictH*parseInt(map.style.zoom)*0.01));
	for(var i=startingRow*pictInCol+2;i<=(endRow+1)*pictInCol;i++){
		if((i-1)%pictInRow>=leftBorder && (i-1)%pictInRow<=rightBorder){
			    map.children[i-1].style.background = "url('map_part_"+i+".jpg')";	  
		}
	}	
}

// Редактирование
function toggleEdit(){
	if(mapEditing){
		mapEditing=false; 
		editButton.style.color="black";
		objForm.style.display="none";
		objTitle.value = "";
		objHref.value = "";
		rect.style.display="none";

		passwForm.style.display="none";
		passwText.value = "";
	}
	else {
		mapEditing=true;
		if(!passwCorrect)passwForm.style.display="block";
		else editButton.style.color="green";
	}
}

// Отправка данных на сервер
if (window.XMLHttpRequest) request = new XMLHttpRequest(); 
else if (window.ActiveXObject) {
try {
	request = new ActiveXObject('Msxml2.XMLHTTP');
} catch (e){
	alert("exeption!");
}
try {
	request = new ActiveXObject('Microsoft.XMLHTTP');
} catch (e){
	alert("exeption!");
}
}
if (request) {
request.onreadystatechange = function() {
if (request.readyState == 4 && request.status == 200)  
{ 
	console.log(request.responseText); 
	if(request.responseText == "Correct password"){
		passwCorrect = true;
		passw = passwText.value;
		passwForm.style.display="none";
		editButton.style.color="green";
	} else if(request.responseText == "Incorrect password"){ // Защита паролем
		passwText.value = "";
		passwText.style.background="red";
		passwText.style.color="white";
		passwText.placeholder = "Неверный пароль";
		passwText.onfocus = function (){
			passwText.style.background="white";
			passwText.style.color="black";
			passwText.placeholder = "Введите пароль";
		}	
	}
}else if(request.status == 500){
	alert("Ошибка на сервере");
}
};
} else alert("Браузер не поддерживает AJAX / AJAX is not supported");


passwSubmit.onclick = function(){ // Защита паролем
	request.open("POST", 'map_server.php', true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	// var text = "<a href='"+href+"' style=' top:"+top+"; left:"+left+";'>"+title+"</a>"
	request.send("passw="+passwText.value+"&type=checkPassw"+"&ajax=1");
}

function addObject(text){ // Отправка ссылок на сервер
	request.open("POST", 'map_server.php', true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.send("passw="+passw+"&type=add&text="+text+"&ajax=1");
}


// удаление элемента
function editObj(a){
	console.log(a);
	if(mapEditing){
		for (var i = 0; i < mapObj.children.length; i++) {
			if(mapObj.children[i] == a) {
				objForm.style.display="none";
				mapObj.removeChild(a);
				request.open("POST", 'map_server.php', true);
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				request.send("passw="+passw+"&type=delete&line_num="+i+"&ajax=1");
			}
		}
	}
}

function show() {
  var obj = link.import.querySelectorAll('div');
  for (var i = 0; i < obj.length; i++) {
  	mapObj.appendChild(obj[i]);
  }
};

