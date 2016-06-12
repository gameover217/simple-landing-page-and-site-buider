/* JS context menu Class for UiGEN.org */
/* requires: doT.js template system */
/* requires: _tech.js ['load_content'] */
/* author: dadmor */
/* licence GPL2 */
var _CX_MENU = {

    "container": {},
    "sub_container": {},
    "menu": [],
    "element_schema": {    
    },
     /* guardian to creade only one done callback */
    "last_loaded_guardian":null,


    init:function(container, sub_container, schema){
        this.container = document.getElementById(container);
        this.sub_container = document.getElementById(sub_container);
    },
    register_menu: function(m_opt, success){
        var s = success;
        this.menu.push(m_opt);
        //this.render_button(m_opt); 
        this.render_menu(function(done){
            if (typeof s === "function") {
                console.log('callback button loaded');
                s(done);
            }
        }, m_opt);   
    },
    render_button: function(m_opt){     
  
        var _e = m_opt;
        load_content( function(_c) {    
            _CX_MENU.container.innerHTML += _c; 
        }, m_opt.tpl_path, m_opt);
        return false;
    },
    active_button: function(id){
        _CX_MENU.sub_container.innerHTML = '';
        document.getElementById(id).classList.add('active');
    },
    disactive_button: function(id){
        document.getElementById(id).classList.remove('active');
    },
    close:function(){
        _CX_MENU.sub_container.style.display = "none";
        for(var index in this.menu) { 
            this.disactive_button(this.menu[index].id);
        }
     },
    /* ------------------------------- */
    render_menu: function(success, m_opt){
        var __s = success;
        _m = m_opt;
        if(_CX_MENU.last_loaded_guardian != _m.name){
            _CX_MENU.last_loaded_guardian = _m.name;
            _CX_MENU.container.innerHTML = '';
            load_content( function(_c) {    
                _CX_MENU.container.innerHTML = _c; 
                __s(_m);
            }, this.menu[0].tpl_path, this.menu);
            
        }else{
            return false;
        }
    },
    callback: function(_t){
        for(var index in this.menu) { 
            var _i = this.menu[index];
            if(_i.id == _t.id){
                if( document.getElementById(_i.id).classList.contains('active') === true){
                    _CX_MENU.disactive_button(_i.id);
                    if(_i.submenu){
                        _CX_MENU.sub_container.style.display = "none";
                    }
                }else{      
                    _CX_MENU.active_button(_i.id);
                    if(_i.submenu){
                        _CX_MENU.sub_container.style.display = "block";
                    }
                }  
                window[_i.onclick_callback](_i);             
            }else{
                _CX_MENU.disactive_button(_i.id);
            } 
        }
    }
} 


