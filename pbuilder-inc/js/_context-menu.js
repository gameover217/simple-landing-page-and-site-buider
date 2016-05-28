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
    init:function(container, sub_container, schema){
        this.container = document.getElementById(container);
        this.sub_container = document.getElementById(sub_container);
    },
    register_menu: function(m_el){
        this.menu.push(m_el);
        this.render_button(m_el);        
    },
    render_button: function(m_el){       
        var _e = m_el;
        load_content( function(_c) {    
            _CX_MENU.container.innerHTML += _c; 
        }, m_el.tpl_path, m_el);
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
    render_menu: function(){
        /*for(var index in this.menu) { 
            var attr = this.menu[index]; 
        }*/
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


