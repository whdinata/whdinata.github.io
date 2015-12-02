function statusChangeCallback(response) {
	console.log('statusChangeCallback');
 	console.log(response);

//deleteCookie();
	console.log("cookie: " + document.cookie);
	if (response.status === 'connected') {
      		//testAPI();
		if(getCookie('realUserId') != '' && window.location.pathname == '/index.html'){
			getUserData();
		} else{
			if(window.location.pathname == '/index.html')
				getUserData();
			else{
				getTimeLine();

			}
		}

    	} else if (response.status === 'not_authorized') {
      		document.getElementById('status').innerHTML = 'Please log into this app.';
    	} else {
      		document.getElementById('status').innerHTML = 'Please log into Facebook.';
    	}
}

function createTimeline(timeline){
	var post = '';	
	for(var i = 0; i < timeline.length; i++){	
		post += '<div id="realInfo1" style="margin-top:10px;">' +
    		 '<div class="panel panel-default">' +
          	'<div class="panel-heading">' + 
          	'<img id="profile1" class="panelImg" src="img/tavin.jpg" style="width:40px;"/>' +
          	'<p id="userName"' + i + ' class="panelName">Tavin</p>' +
          	'<p id="time"' + i + ' class="panelTime">1 hr</p>' +
          	'</div>' +
          	'<div id="context" class="panel-body">' + timeline[i].message + '</div>' +
      		'</div>' +
  		'</div>';
	}

	$("div.content").append(post);
}

function getCookie(cname){
	var name = cname + "=";
	var cookies = document.cookie.split(';');
	for(var i=0; i < cookies.length; i++){
		var c = cookies[i];
		while(c.charAt(0) == ' ') c = c.substring(1);
		if(c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}

	return '';
}

function checkLoginState() {
	FB.getLoginStatus(function(response) {
     		statusChangeCallback(response);
    	});
}

window.fbAsyncInit = function() {
	FB.init({
    		appId      : '1666231746988158',
    		cookie     : true,  // enable cookies to allow the server to access the session
    		xfbml      : true,  // parse social plugins on this page
    		version    : 'v2.2' // use version 2.2
  	});

	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
  };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "http://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

function getUserData() {
	console.log('Welcome!  Fetching your information.... ');
    	FB.api('/me', function(response) {
      		console.log('Successful login for: ' + response.name);
      		document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';

		if(getCookie('realUserId') == ''){
			logout();
			document.cookie = "realUserId=" + response.id;
			//window.location.assign("http://ec2-54-77-150-48.eu-west-1.compute.amazonaws.com/join.html");
		} else{
			document.cookie = "fakeUserId=" + response.id;
			window.location.assign("http://ec2-54-77-150-48.eu-west-1.compute.amazonaws.com/realinfo.html");
		}
    	});
}

function login(){
	FB.login(function (response){
		checkLoginState();	
	},{
		scope: 'user_posts, publish_actions'
	});
}

function postToFB(){
	console.log('post');
	var text = document.getElementById("status").value;
	console.log('FB post');
	FB.api(
		"/me/feed/",
		"POST",
		{
			"message" : text
		},

		function (response){
			if(response && !response.error){
				alert("posted");
				console.log("Your post has been posted");
				
			} else{
				alert(response.error.message);
				console.log("error: " + response.error.message);
			}
		});

	
	postToParse(response.id, getCookie('realUserId'), getCookie('fakeUserId'));
	console.log('after FB post');
}

function getTimeLine(){
	FB.api(
		"/me/feed",
		function (response){
			if(response && !response.error){
				var keys = Object.keys(response);
				console.log(response.data);
				timeline = response.data;
				createTimeline(timeline);
			}
		});
}

function logout(){
	FB.logout(function (response){ 
		console.log("Logout");	
	});
}

function deleteCookie(){
	document.cookie = "realUserId=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	document.cookie = "userId=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
