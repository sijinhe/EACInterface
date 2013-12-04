// JavaScript Document

var Template_Autumn='\
    <div class="designer">\
        Autumn Theme<br/>\
        Designer: Bill<br/>\
        (gorebill@163.com)\
    </div>\
	\
    <div id="grids"></div>\
    \
    <div id="animeBlock"></div>\
  	\
    <div id="illusion">\
        <span id="illusionZ"></span>\
        <span id="illusionY"></span>\
        <span id="magicube"></span>\
    </div>\
 ';

$(function(){
	$.template("themeAutumn", Template_Autumn);
	$.tmpl("themeAutumn").appendTo("#container");
	
	$("#logBtn").children("img").attr("src", "css/image/theme_autumn/home_login.png");
	$("#regBtn").children("img").attr("src", "css/image/theme_autumn/home_reg.png");
	$("#rsnBtn").children("img").attr("src", "css/image/theme_autumn/home_mail.png");
	
	$('#logBtn').mouseover(function(){
		$(this).find('img').attr('src', 'css/image/theme_autumn/home_login_2.png');
	}).mouseout(function(){
		$(this).find('img').attr('src', 'css/image/theme_autumn/home_login.png');
	});	
	
	$('#regBtn').mouseover(function(){
		$(this).find('img').attr('src', 'css/image/theme_autumn/home_reg_2.png');
	}).mouseout(function(){
		$(this).find('img').attr('src', 'css/image/theme_autumn/home_reg.png');
	});
	
	$('#rsnBtn').mouseover(function(){
		$(this).find('img').attr('src', 'css/image/theme_autumn/home_mail_2.png');
	}).mouseout(function(){
		$(this).find('img').attr('src', 'css/image/theme_autumn/home_mail.png');
	});
  
	startSpecialAnime();
	
	initGrids();
	
	startGridAnime();
	
	startIllusionAnime();
  
});

function startIllusionAnime() {
  
  if($.browser.webkit) {
    var iRZ=new IRotate();
    
    $("#illusionZ").bind("toan", function(){
      $(this).animate({opacity:1.0}, {
        duration: 5000,
        step: function(now, fx) {
          $("#illusionZ").css({"-webkit-transform":iRZ.getR(["Z","X"], now)});
        },
        complete: function() {
          $(this).trigger("toan");
        }
      });
    }).trigger("toan");
    
    
    $("#illusionY").bind("toan", function(){
      $(this).animate({opacity:1.0}, {
        duration: 5000,
        step: function(now, fx) {
          $("#illusionY").css({"-webkit-transform":iRZ.getR(["Y","X"])});
        },
        complete: function() {
          $(this).trigger("toan");
        }
      });
    }).trigger("toan");
    
    $("#magicube").bind("click", function(){
      
    });
    
  }else{
      $("#illusion").hide();
  }
}

function IRotate() {
  this.r=0;
  this.getR=function(d){
    var rotate="";
    
    for(i=0; i<d.length; i++) {
      rotate+="rotate"+d[i]+"("+(this.r+=0.5)+"deg"+") ";
    }
    
    return rotate;
  }
}

function initGrids() {
  for(i=1; i<=13; i++) {
   var left=0;
   var top=0;
   var grid_pic='grid_'+(i+20)+'.png';
   
   if(i>7){
     left=(64+5)*(i-1-7);
     top=(64+5)*2;
   }else if(i>4) {
     left=(64+5)*(i+1-4);
     top=(64+5)*1;
   }else{
     left=(64+5)*(i);
   }
   
   $('#grids').append('<div id="grid_'+i+'" style="position:absolute;left:'+left+'px;top:'+top+'px;default;width:64px;height:64px;background:url(css/image/theme_autumn/grids/'+grid_pic+') top no-repeat;"></div>');
  }
}

function startGridAnime() {
	setTimeout('revertGrid_p1()', 2500);
 
 	//revertGrid(1, 20);
}

function revertGrid_p1() {	
 	$('#grid_1').animate({width: '0px', left:'+=32px'},{duration:200,easing:'linear',complete:function(){$(this).css('background', 'url(css/image/theme_autumn/grids/grid_1.png) top no-repeat');revertGrid_p2();}})
 			.animate({width: '64px', left:'-=32px'},{duration:200,easing:'linear'})
 		.next().animate({width: '0px', left:'+=32px'},{duration:200,easing:'linear',complete:function(){$(this).css('background', 'url(css/image/theme_autumn/grids/grid_2.png) top no-repeat');}})
 			.animate({width: '64px', left:'-=32px'},{duration:200,easing:'linear'})
 		.next().animate({width: '0px', left:'+=32px'},{duration:200,easing:'linear',complete:function(){$(this).css('background', 'url(css/image/theme_autumn/grids/grid_3.png) top no-repeat');}})
 			.animate({width: '64px', left:'-=32px'},{duration:200,easing:'linear'})
 		.next().animate({width: '0px', left:'+=32px'},{duration:200,easing:'linear',complete:function(){$(this).css('background', 'url(css/image/theme_autumn/grids/grid_4.png) top no-repeat');}})
 			.animate({width: '64px', left:'-=32px'},{duration:200,easing:'linear'});
}

function revertGrid_p2() {	
 	$('#grid_5').delay(2000).animate({width: '0px', left:'+=32px'},{duration:200,easing:'linear', complete:function(){$(this).css('background', 'url(css/image/theme_autumn/grids/grid_5.png) top no-repeat');revertGrid_p3();}})
 			.animate({width: '64px', left:'-=32px'},{duration:200,easing:'linear'})
 		.next().delay(2000).animate({width: '0px', left:'+=32px'},{duration:200,easing:'linear',complete:function(){$(this).css('background', 'url(css/image/theme_autumn/grids/grid_6.png) top no-repeat');}})
 			.animate({width: '64px', left:'-=32px'},{duration:200,easing:'linear'})
 		.next().delay(2000).animate({width: '0px', left:'+=32px'},{duration:200,easing:'linear',complete:function(){$(this).css('background', 'url(css/image/theme_autumn/grids/grid_7.png) top no-repeat');}})
 			.animate({width: '64px', left:'-=32px'},{duration:200,easing:'linear'});
}

function revertGrid_p3() {	
 	$('#grid_8').delay(2000).animate({width: '0px', left:'+=32px'},{duration:200,easing:'linear', complete:function(){$(this).css('background', 'url(css/image/theme_autumn/grids/grid_8.png) top no-repeat');revertGrid_p4();}})
 			.animate({width: '64px', left:'-=32px'},{duration:200,easing:'linear'})
 		.next().delay(2000).animate({width: '0px', left:'+=32px'},{duration:200,easing:'linear',complete:function(){$(this).css('background', 'url(css/image/theme_autumn/grids/grid_9.png) top no-repeat');}})
 			.animate({width: '64px', left:'-=32px'},{duration:200,easing:'linear'})
 		.next().delay(2000).animate({width: '0px', left:'+=32px'},{duration:200,easing:'linear',complete:function(){$(this).css('background', 'url(css/image/theme_autumn/grids/grid_10.png) top no-repeat');}})
 			.animate({width: '64px', left:'-=32px'},{duration:200,easing:'linear'})
 		.next().delay(2000).animate({width: '0px', left:'+=32px'},{duration:200,easing:'linear',complete:function(){$(this).css('background', 'url(css/image/theme_autumn/grids/grid_11.png) top no-repeat');}})
 			.animate({width: '64px', left:'-=32px'},{duration:200,easing:'linear'})
 		.next().delay(2000).animate({width: '0px', left:'+=32px'},{duration:200,easing:'linear',complete:function(){$(this).css('background', 'url(css/image/theme_autumn/grids/grid_12.png) top no-repeat');}})
 			.animate({width: '64px', left:'-=32px'},{duration:200,easing:'linear'})
 		.next().delay(2000).animate({width: '0px', left:'+=32px'},{duration:200,easing:'linear',complete:function(){$(this).css('background', 'url(css/image/theme_autumn/grids/grid_13.png) top no-repeat');}})
 			.animate({width: '64px', left:'-=32px'},{duration:200,easing:'linear'});
}

function revertGrid_p4() {	
	for(i=1; i<=13; i++) {
		if(i==1)
			$('#grid_'+i).delay(5000).animate({opacity:0},{duration:1500, complete:function(){revertGrid_p5();revertGrid_p6();}});
		else
			$('#grid_'+i).delay(5000).animate({opacity:0},{duration:1500, complete:function(){revertGrid_p5();}});
	}
}

function revertGrid_p5() {	
	for(i=1; i<=13; i++) {
		$('#grid_'+i).css('background', 'url(css/image/theme_autumn/grids/grid_'+(i+20)+'.png) top no-repeat');
	}
}

function revertGrid_p6() {	
	for(i=1; i<=13; i++) {
		if(i==1)
			$('#grid_'+i).animate({opacity:1},{duration:500, complete:function(){revertGrid_p7();}});
		else
			$('#grid_'+i).animate({opacity:1},{duration:500});
	}
}

function revertGrid_p7() {
	setTimeout('revertGrid_p1()', 5000);
}

function startSpecialAnime() {
  $('#animeBlock').animate({
  	left: '800px'
  },{
   duration:2500
  }).animate({
  	top: '500px'
  },{
   duration:2500
  }).animate({
  	left: '-5px'
  },{
   duration:2500
  }).animate({
  	top: '-5px'
  },{
   duration:2500,
   complete: function() {
    startSpecialAnime();
   }
  });
}








