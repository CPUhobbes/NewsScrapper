var numArticles;
var numComments;


$(document).ready(function(){

	//Number of Articles and comments present on page
	numArticles = $('.articleContainer').length;
	numComments = $('.commentText').length;

	//Display first story and comment
	$("#story_0").css("display", "block");
	if(numComments>0){
		$("#commentText_0").css("display", "block");
	}

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

	$("#story_"+newPostion).css("display", "block");


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

	$("#story_"+newPostion).css("display", "block");


});

$(".commentLine").on("click", function(){
	var commentNum = $(this).attr("data-commentNum");
	$(".commentText").css("display", "none");
	$("#commentText_"+commentNum).css("display", "block");
	
});

$(".deleteComment").on("click", function(){
	var deleteNum = $(this).attr("data-deleteNum");

	$("#commentTitle_"+deleteNum).remove();
	$("#commentText_"+deleteNum).remove();
	
});

$('#sendComment').on("click", function() {

  	$.ajax({
        type: "PUT",
        url: '/commentAdd/5844ac05c88c7f543efa3443',
        data: {
            title: "testing123",
            body: "coolghjkghjkgio"
        }

    });

});




