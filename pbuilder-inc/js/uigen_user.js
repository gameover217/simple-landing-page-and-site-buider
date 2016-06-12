var _USER = {
	
	"token":undefined,
	"current":undefined,

	token_status: function(){
		/* check browser */
		if(typeof(Storage) === "undefined") {					
			alert('THIS APP REQUIRES BETTER BROWSER - YOUR IS TOO OLD!!! /nDownload and install new browser on this: /nhttp://outdatedbrowser.com');
			return false;
		}
		/* check url */
		if(getUrlParamByName('token')){
			this.token = getUrlParamByName('token');
			sessionStorage.access_token = this.token;
			return true;
		}
		/* check session */
		if(sessionStorage.access_token){
			this.token = sessionStorage.access_token;
			return true;
		}
		/* no token */
		if(this.token){
			return false;
		}
	},
	get_current: function(){

		if(this.current){
			return this.current;

		}else{
			return false;
		}
	},
	login: function(success,fail){
		
		var _s = success;
		if(this.token_status()){
			_GITHUBAPI.get_user(this.token,function(success){
				_USER.current = JSON.parse(success);
				_s(_USER.current);
			});

		}else{
			fail();
		}
	},


	
}