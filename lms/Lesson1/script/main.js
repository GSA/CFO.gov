var isMobile = {
    
    Android: function() {
    	//alert(navigator.userAgent);
    	return navigator.userAgent.indexOf("Android")>-1;
        //return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

var audiofile="";
var CurrentLesson=0;
var CurrentPage="";
var CurrentModule=0;

var PageNext="";
var PageBack="";
var NextEnabled=true;
var BackEnabled=true;
var Dependencies="";
var CCEnabled=false;
var AudioEnabled=false;
var IsQuestion=false;
var thisPageNumber = 1;
var FinalPageCount;

function ForceNumbering(){
	var s="Page ";
	var number = parent.getPageNumber(CurrentLesson,CurrentPage);
	if(number){
		s+= number + " of " + FinalPageCount;
		document.getElementById("screennumber").innerHTML=s;
	}
	else{
		s+= thisPageNumber + " of " + FinalPageCount;
		document.getElementById("screennumber").innerHTML=s;
	}	
}

function SetProgress(){
	var Progress = new Array();
	lessons = parent.LessonPageVisited.slice(0,2);
	for(i=0;i<lessons.length;i++){
		var pages = lessons[i].split("|");
		if(CurrentModule==1){
			if(pages.indexOf("00000")!=-1){
				Progress.push.apply(Progress, pages);
			}
		}
		if(CurrentModule==2){
			if(pages.indexOf("00100")!=-1){
				Progress.push.apply(Progress, pages);
			}
		}
	}
	var n = Progress.length+1;
	var r=n/FinalPageCount;
	r=Math.round(r*400,0);
	document.getElementById("progressindicator").style.width="" + r + "px";
}


function doState(){
	var s="";
	var i;
	var j;
	var k;
	var pcflag;
	s+=window.location;
	//console.log(s);
	FindML(s);
	//console.log(CurrentLesson);
	GetPageName();
	try{parent.setVisited(CurrentLesson,CurrentPage);}catch(err){}
	ForceNumbering();
	SetProgress();
	//try{parent.setCompleted(CurrentLesson,CurrentPage);}catch(err){}
	try{pcflag=parent.isPageComplete(CurrentLesson,CurrentPage);}catch(err){pcflag=false;}
	//console.log(CurrentLesson + " " + CurrentPage);
	//alert(pcflag);
	if(!CCEnabled){
		Disable('cc');
	}
	if(!AudioEnabled){
		Disable('audio');
	}
	if(!BackEnabled){
		Disable('back');
	}
	if(!NextEnabled || IsQuestion){
		if(!pcflag){
			Disable('next');
		}
		else{
			Enable('next');
		}
	}	
}

function FindML(s){	
	//alert(s);
	
	if(s.indexOf("Module1")>-1){
		CurrentModule=1;
		FinalPageCount = 73;
		if(s.indexOf("Lesson1")>-1){
			CurrentLesson=1;
			return;

		}
		if(s.indexOf("Lesson2")>-1){
			CurrentLesson=2;
			return;

		}

	}
	
	if(s.indexOf("Module2")>-1){
		CurrentModule=2;
		FinalPageCount = 26;
		if(s.indexOf("Lesson1")>-1){
			CurrentLesson=1;
			return;
		}
		if(s.indexOf("Lesson2")>-1){
			CurrentLesson=2;
			return;
		}
	}

	if(s.indexOf("Module3")>-1){
		FinalPageCount = 60;
		if(s.indexOf("Lesson1")>-1){
			CurrentLesson=1;
			return;
		}
		if(s.indexOf("Lesson2")>-1){
			CurrentLesson=2;
			return;
		}
	}

	if(s.indexOf("Module4")>-1){
		FinalPageCount = 117;
		if(s.indexOf("Lesson1")>-1){
			CurrentLesson=1;
			return;
		}
		if(s.indexOf("Lesson2")>-1){
			CurrentLesson=2;
			return;
		}
		if(s.indexOf("Lesson3")>-1){
			CurrentLesson=3;
			return;
		}
		if(s.indexOf("Lesson4")>-1){
			CurrentLesson=4;
			return;
		}
		if(s.indexOf("Lesson5")>-1){
			CurrentLesson=5;
			return;
		}
		if(s.indexOf("Lesson6")>-1){
			CurrentLesson=6;
			return;
		}
	}

	if(s.indexOf("Module5")>-1){
		FinalPageCount = 52;
		if(s.indexOf("Lesson1")>-1){
			CurrentLesson=1;
			return;
		}
		if(s.indexOf("Lesson2")>-1){
			CurrentLesson=2;
			return;
		}
	}

	if(s.indexOf("Module6")>-1){
		FinalPageCount = 160;
		if(s.indexOf("Lesson1")>-1){
			CurrentLesson=1;
			return;
		}
		if(s.indexOf("Lesson2")>-1){
			CurrentLesson=2;
			return;
		}
	}
}

function GetPageName(){
	var s="";
	var ss;
	var i;
	s+=window.location;
	
	i=s.lastIndexOf("/");
	ss=s.substr(i+1);
	
	i=ss.indexOf(".");
	ss=ss.substring(0,i);
	CurrentPage=ss;
}

//button rollover functions

function Rollover(name){
	if(name=="exit"){
		document.getElementById('exitbtn').src="../../images/btn_exit_ov.jpg";
		return;
	}
	if(name=="ref"){
		document.getElementById('refbtn').src="../../images/btn_reference_ov.jpg";
		return;
	}
	if(name=="glossary"){
		document.getElementById('glossarybtn').src="../../images/btn_glossary_ov.jpg";
		return;
	}
	if(name=="index"){
		document.getElementById('indexbtn').src="../../images/btn_index_ov.jpg";
		return;
	}
	if(name=="home"){
		document.getElementById('homebtn').src="../../images/btn_home_ov.jpg";
		return;
	}
	if(name=="cc"){
		if(CCEnabled){
			document.getElementById('ccbtn').src="../../images/btn_cc_ov.jpg";
		}
		return;
	}
	if(name=="audio"){
		if(AudioEnabled){
			document.getElementById('audiobtn').src="../../images/btn_audio_ov.jpg";
		}
		return;
	}
	if(name=="back"){
		if(BackEnabled){
			document.getElementById('backbtn').src="../../images/btn_back_ov.jpg";
		}
		return;
	}
	if(name=="next"){
		if(NextEnabled){
			document.getElementById('nextbtn').src="../../images/btn_next_ov.jpg";
		}
		return;
	}

}

function Rollout(name){
	if(name=="exit"){
		document.getElementById('exitbtn').src="../../images/btn_exit_up.jpg";
		return;
	}
	if(name=="ref"){
		document.getElementById('refbtn').src="../../images/btn_reference_up.jpg";
		return;
	}
	if(name=="glossary"){
		document.getElementById('glossarybtn').src="../../images/btn_glossary_up.jpg";
		return;
	}
	if(name=="index"){
		document.getElementById('indexbtn').src="../../images/btn_index_up.jpg";
		return;
	}
	if(name=="home"){
		document.getElementById('homebtn').src="../../images/btn_home_up.jpg";
		return;
	}
	if(name=="cc"){
		if(CCEnabled){
			document.getElementById('ccbtn').src="../../images/btn_cc_up.jpg";
		}
		return;
	}
	if(name=="audio"){
		if(AudioEnabled){
			document.getElementById('audiobtn').src="../../images/btn_audio_up.jpg";
		}
		return;
	}
	if(name=="back"){
		if(BackEnabled){
			document.getElementById('backbtn').src="../../images/btn_back_up.jpg";
		}
		return;
	}
	if(name=="next"){
		if(NextEnabled){
			document.getElementById('nextbtn').src="../../images/btn_next_up.jpg";
		}
		return;
	}
}

function Disable(name){
	if(name=="cc"){
		CCEnabled=false;
		document.getElementById('ccbtn').src="../../images/btn_cc_dm.jpg";
		return;
	}
	if(name=="audio"){
		AudioEnabled=false;
		document.getElementById('audiobtn').src="../../images/btn_audio_dm.jpg";
		return;
	}
	if(name=="back"){
		BackEnabled=false;
		document.getElementById('backbtn').src="../../images/btn_back_dm.jpg";
		return;
	}
	if(name=="next"){
		NextEnabled=false;
		document.getElementById('nextbtn').src="../../images/btn_next_dm.jpg";
		return;
	}
}

function Enable(name){
	if(name=="cc"){
		CCEnabled=true;
		document.getElementById('ccbtn').src="../../images/btn_cc_up.jpg";
		return;
	}
	if(name=="audio"){
		AudioEnabled=true;
		document.getElementById('audiobtn').src="../../images/btn_audio_up.jpg";
		return;
	}
	if(name=="back"){
		BackEnabled=true;
		document.getElementById('backbtn').src="../../images/btn_back_up.jpg";
		return;
	}
	if(name=="next"){
		NextEnabled=true;
		document.getElementById('nextbtn').src="../../images/btn_next_up.jpg";
		return;
	}
}







//button action functions
function Click(name){
	//var s="";
	//s+=window.location;
	//parent.SetBookmark(s);
	if(name=="exit"){
		doExit();
	}
	if(name=="ref"){
		doReferences();
	}
	if(name=="glossary"){
		doGlossary();
	}
	if(name=="index"){
		doIndex();
	}
	if(name=="home"){
		doHome();
	}
	if(name=="cc"){
		if(CCEnabled){
			doCC();
			return;
		}
	}
	if(name=="audio"){
		if(AudioEnabled){
			doAudio();
			return;
		}
	}
	if(name=="back"){
		if(BackEnabled){
			doBack();
			return;
		}
	}
	if(name=="next"){
		if(NextEnabled){
			doNext();
			return;
		}
	}
}

function doExit(){
	top.close();

}

function doReferences(){
}

function doGlossary(){
}

function doIndex(){
}

function doHome(){
	var s="";
	s+=window.location;
	if(s.indexOf("Menu/menu.htm")<0){
		window.location="../Menu/menu.htm"
	}
	
}

function doCC(){
	//toggle CC where it applies
}

function doAudio(){
	//toggle audio where it applies
}

function doBack(){
	var url;
	if(BackEnabled){
		if(PageNext!=""){
			url=PageBack + ".htm";
			//if(parent.popWin!=null){parent.popWin.self.close();}
			try{if(parent.popWin){parent.popWin.self.close();}}catch(err){}
			window.location=url;
			
		}
	}
}

function doNext(){
	var url;
	var s="";
	s+=window.location;
	if(NextEnabled){
		//
		try{parent.setCompleted(CurrentLesson,CurrentPage);}catch(err){}
		console.log(PageNext);
		if(PageNext!=""){
			url=PageNext + ".htm";
			//if(parent.popWin!=null){parent.popWin.self.close();}
			try{if(parent.popWin){parent.popWin.self.close();}}catch(err){}
			window.location=url;
		}
	}
}












//audio functions
function DoAudioJWPlayerNA(){
	if(audiofile!=""){
		jwplayer("audioplayer").setup({
		  autostart: false,
		  controlbar: "bottom",
		  dock: true,
		  flashplayer: "flash/player.swf",
		  file: "audio/" + audiofile,
		  height: 30,
		  width:300
		});
	}
	
}

//feedback

function DisplayFeedback(Feedback,height,width)
{    
	if(arguments.length<2){
		win_height = 450;
		win_width = 600;
	}
	else{
		win_height = height;
		win_width = width;
	}

	var props = "channelmode=no,directories=no,fullscreen=no,location=no,menubar=no,resizable=yes,";
	props += "scrollbars=no,status=no,titlebar=no,toolbar=no,";
        props += "top=50,left=50,height="+win_height+",width="+win_width;
        try{if(parent.popWin){parent.popWin.self.close();}}catch(err){}
        
	parent.popWin=window.open("","",props,true);
	//parent.popWin=window.open("","detail","toolbar=no,location=no,directories=no,status=no,scrollbars=yes,menubar=no,resizable=yes,width=" + vwidth + ",height=" + vheight + ",left=" + tWidth/2 + ",top=50");
	//parent.popWin=window.open("","Feedback1","width=400,height=300,left=180,top=110,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no");
	if (parent.popWin != null)
	{
		parent.popWin.document.write('<html><head><title>Feedback</title>');
		parent.popWin.document.write('<link rel="stylesheet" href="../../css/main.css"></head><body LEFTMARGIN=0 TOPMARGIN=0 MARGINWIDTH=0 MARGINBOTTOM=0 MARGINHEIGHT=0>');
		parent.popWin.document.write('<div class="pop_main">');
		parent.popWin.document.write(Feedback);		
		parent.popWin.document.write('<div class="pop_btnClose" id="divClose"><a accesskey="q" href="javascript:window.self.close();"><button>Close</button></a></div>');
		parent.popWin.document.write('</div>');
		parent.popWin.document.write('<script language="javascript">try{opener.jumpNextQuestion();}catch(err){}</script></body></html>');
		
		parent.popWin.document.close();
	}
	parent.popWin.opener=this;
	parent.popWin.focus();
}

