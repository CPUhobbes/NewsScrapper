var numArticles;
var numComments;

function showComments(id){
	numComments = $('.commentText').length;
	console.log(numComments);
	$("#commentText_0").css({"display": "block"});
	if(numComments>0){
		$("#commentText_"+id).css({"display": "block"});
	}

}

function createDivBlock(index, value){
	var divBlock = '<div class=\"commentLine\" id=\"commentTitle_'+index+'\" data-commentNum=\"'+index+'\">'+
							'<div class=\"inlineLeft\">'+
								'<p class=\"commentTitleText\">'+value.title+'</p>'+
							'</div>'+
							'<div class=\"inlineRight noselect\">'+
								'<p class=\"deleteComment\" data-deleteNum=\"'+index+'\">X</p>'+
							'</div>'+
						'</div>';

	var divBody = '<p class=\"commentText\" id=\"commentText_'+index+'\">'+value.body+'</p>';
	$('#commentTitleBox').append(divBlock);
	$('#commentBodyBox').append(divBody);
}

function loadComments(id){
	$('#commentTitleBox').empty();
	$('#commentBodyBox').empty();
	var url = '/comment/'+$('#story_'+id).attr('data-obj_id');
	$.ajax({
        type: "GET",
        url: url,
    }).done(function(result) {
    	result.forEach(function(value, index){
    		createDivBlock(index, value);
    		console.log(value, index);
    	})
    showComments(id);
    });
}

function updateCommentBox(id){
	$("#story_"+id).css("display", "block");
	$('#sendComment').attr('data-currentArticle', id);
	$('#commentTitleBox').empty();
	$('#commentBodyBox').empty();
	loadComments(id);


}

$(document).ready(function(){

	loadComments(0);

	//Number of Articles and comments present on page
	numArticles = $('.articleContainer').length;
	

	//Display first story and comment
	$("#story_0").css("display", "block");

	//Set data backword to last element
	$("#arrowLeft").attr("data-position", numArticles-1);


	//Matrix Background
	var width = matrix.width=($(document).width());
	var height = matrix.height=($(document).height());
	var yPositions = Array(300).join(0).split('');
	var ctx=matrix.getContext('2d');
 
	var draw = function () {
  		ctx.fillStyle='rgba(0,0,0,.05)';
  		ctx.fillRect(0,0,width,height);
  		ctx.fillStyle='#00FF00';
  		ctx.font = '10pt Courier';
  		yPositions.map(function(y, index){
    		var text = String.fromCharCode(1e2+Math.random()*33);
    		var x = (index * 10)+10;
    		matrix.getContext('2d').fillText(text, x, y);
			if(y > 100 + Math.random()*1e4){
	  			yPositions[index]=0;
			}
			else{
      			yPositions[index] = y + 10;
			}
  		});
	};

	function RunMatrix(){
		if(typeof Game_Interval != "undefined") clearInterval(Game_Interval);
			Game_Interval = setInterval(draw, 100);
	}
	RunMatrix();

});


//Click Handlers

$("#arrowLeft").on("click", function(){
	var newPostion = parseInt($("#arrowLeft").attr("data-position"));
	if((newPostion-1) < 0){
		$("#arrowLeft").attr("data-position", numArticles-1);
	}
	else{
		$("#arrowLeft").attr("data-position", newPostion-1);
	}

	if((newPostion)===(numArticles-1)){
		$("#story_0").css("display", "none");
		$("#arrowRight").attr("data-position", 0);
	}
	else{
		$("#story_"+(newPostion+1)).css("display", "none");
		$("#arrowRight").attr("data-position", (newPostion+1));
	}
	updateCommentBox(newPostion);
	

});

$("#arrowRight").on("click", function(){
	var newPostion = parseInt($("#arrowRight").attr("data-position"));
	if((newPostion+1) > (numArticles-1) ){
		$("#arrowRight").attr("data-position", 0);
	}
	else{
		$("#arrowRight").attr("data-position", newPostion+1);
	}

	if((newPostion)=== 0){
		$("#story_"+(numArticles-1)).css("display", "none");
		$("#arrowLeft").attr("data-position", (numArticles-1));
	}
	else{
		$("#story_"+(newPostion-1)).css("display", "none");
		$("#arrowLeft").attr("data-position", (newPostion-1));
	}

	updateCommentBox(newPostion);


});

$(document).on("click",".inlineLeft", function(){

	var commentNum = $(this).parent().attr("data-commentNum");
	$(".commentText").css("display", "none");
	console.log(commentNum);
	$("#commentText_"+commentNum).css({"display":"block"});
	
});

$(document).on("click", ".deleteComment", function(){
	var deleteNum = $(this).attr("data-deleteNum");
	var data = {title:$("#commentTitle_"+deleteNum+' p').html().trim()};
	var article_id = $('#sendComment').attr('data-currentArticle');
	var url = '/comment/'+$('#story_'+article_id).attr('data-obj_id');
	$("#commentText_"+deleteNum).remove();
	//$("#commentText_1").css({"display": "block"});
	//showComments(deleteNum);
		$.ajax({
        type: "DELETE",
        url: url,
        data: data
    }).done(function(result) {

    	loadComments(article_id);


    });

});

$('#sendComment').on("click", function() {

	var article_id = $('#sendComment').attr('data-currentArticle');
	var url = '/comment/'+$('#story_'+article_id).attr('data-obj_id');

	var data = {title: $("#commentTitle").val(),
				body:$("#commentBody").val()						
			};
	$("#commentTitle").val("");
	$("#commentBody").val("");
	
	console.log(url, data);

  	$.ajax({
        type: "PUT",
        url: url,
        data: data
    }).done(function(result) {

    	loadComments(article_id);
    });
});




