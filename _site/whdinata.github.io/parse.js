function initParse(){
	Parse.initialize("ZAA1xdyjNkKyYnTy64iJiID24IyuAcxSN57k4HJn", "203A0wNliLYRjOKGHBnx7A8KRLvYrzBUiF1Fr2Qd");
}

function postToParse(fbPostId, userId, fakeUserId){

	console.log('here!');
	var Post = Parse.Object.extend("Post");
	var post = new Post();
	post.save({facebook_post_id: fbPostId, user_id: userId, fake_user_id: fakeUserId}).then(function(object){
		alert("posted");
	}); 
}

function getData(fakeUserId){
	var Post = Parse.Object.extend("Post");
	var query = new Parse.Query(Post);

	query.equalTo("fake_user_id", fakeUserId);
	query.find({
		success: function (results){
			console.log(results);
			return results;
		},
		error: function(error){
			return null;
		}
	});
}
