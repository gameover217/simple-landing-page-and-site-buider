/* DESIGN MODE */
var _bTrform = {
	move_guardian:false,
	on_guardian:true,
	scroll_guardian:false,
	data:{
		x:0,
		y:0,
		startX:0,
		startY:0,
		scale:1
	},
	init:function(){
		var _pb = document.getElementById('page-builder');
		var _bd = document.getElementById("body");
		_bd.setAttribute('style','overflow: hidden; height:100%; cursor: -webkit-grab; cursor: -moz-grab;');
		
		_pb.onmousedown = function(){ _bTrform.off(); }
		_pb.onmousemove = function(){ _bTrform.off(); } 
		_pb.onmouseover = function(){ _bTrform.off(); _bTrform.scroll_guardian=true; }
		_pb.onmouseup = function(){ _bTrform.on(); }
		_pb.onmouseout = function(){_bTrform.scroll_off(); }
		
		_bd.onmousedown = function(event){ _bTrform.on(); _bTrform.body_down(event) }
		_bd.onmousemove = function(event){ _bTrform.body_move(event) }
		_bd.onmouseup = function(event){ _bTrform.body_up(event) }

		if (_bd.addEventListener) {
			_bd.addEventListener("mousewheel", _bTrform.MouseWheelHandler, false);
			_bd.addEventListener("DOMMouseScroll", _bTrform.MouseWheelHandler, false);
		}
		else _bd.attachEvent("onmousewheel", _bTrform.MouseWheelHandler);
	},
	destroy:function(){
		this.data.scale = 1;
		this.data.x = 0;
		this.data.y = 0;
		this.transform();

		var _pb = document.getElementById('page-builder');
		var _bd = document.getElementById("body");
		_bd.setAttribute('style','overflow: scroll; height:auto;');
		_pb.onmousedown = function(){  }
		_pb.onmousemove = function(){  } 
		_pb.onmouseover = function(){  }
		_pb.onmouseup = function(){  }
		_pb.onmouseout = function(){ }
		
		_bd.onmousedown = function(event){ }
		_bd.onmousemove = function(event){ }
		_bd.onmouseup = function(event){ }
		_bd.removeEventListener("mousewheel", _bTrform.MouseWheelHandler);
		_bd.removeEventListener("DOMMouseScroll", _bTrform.MouseWheelHandler);
		_bd.removeEventListener("onmousewheel", _bTrform.MouseWheelHandler);
	},
	body_down:function(e){
		this.move_guardian = true;
		this.data.startX = e.clientX - this.data.x;
		this.data.startY = e.clientY - this.data.y;
	},
	body_up:function(e){
		this.move_guardian = false;
		this.data.startX = e.clientX;
		this.data.startY = e.clientY;
	},
	body_move:function(e){
		if(this.on_guardian){			
			if(this.move_guardian){
				this.data.x = e.clientX-this.data.startX;
				this.data.y = e.clientY-this.data.startY;
				//document.getElementById("page-builder-wraper").setAttribute('style','transform:rotate(90deg); -webkit-transform: rotate(90deg)') ;
				//document.getElementById("page-builder-wraper").style.webkitTransform = "translate2d("++",0)";
				//document.getElementById("page-builder-wraper").style.transform = "translate2d("+e.clientX-startX+",0)";
				this.transform();
			}
		}
	},
	MouseWheelHandler:function(e){
		if(_bTrform.scroll_guardian==false){
			document.getElementById("body").setAttribute('style','overflow: hidden; height:100%; cursor: -webkit-grab; cursor: -moz-grab;');
			var evt=window.event || e //equalize event object
	    	var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta;
	    	if(delta>0){
	    		_bTrform.data.scale+=0.05;
	    	}else{
	    		_bTrform.data.scale-=0.05;
	    	}
	    	_bTrform.transform();
	    }else{
	    	var evt=window.event || e //equalize event object
	    	var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta;
	    	if(delta>0){
	    		_bTrform.data.y+=30;
	    	}else{
	    		_bTrform.data.y-=30;
	    	}
	    	_bTrform.transform();
	    	//document.getElementById("body").setAttribute('style','overflow: hidden; height:auto');
	    }
	},
	scroll_off:function(){
		this.scroll_guardian=false;
		document.getElementById("body").setAttribute('style','overflow: hidden; height:100%; cursor: -webkit-grab; cursor: -moz-grab;');
	},
	off:function(){
		this.on_guardian = false;
		//document.getElementById("body").setAttribute('style','overflow: hidden; height:auto');
	},
	on:function(){
		this.on_guardian = true;
	},
	transform:function(){
		var out = "display:block; ";
		out += "transform: translate("+this.data.x+"px,"+this.data.y+"px) scale("+this.data.scale+");";
		out += "-webkit-transform: translate("+this.data.x+"px,"+this.data.y+"px) scale("+this.data.scale+");";
		
		document.getElementById("page-builder-wraper").setAttribute('style',out);
		
		var out = "";
		//out += "background-position: "+this.data.x+"px "+this.data.y+"px;";
		out += "overflow: hidden; height:100%; cursor: -webkit-grab; cursor: -moz-grab;";
		document.getElementById("body").setAttribute('style',out);

	}
}

