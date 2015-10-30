(function( login, $, undefined ) {
	var validate=function(){
		flag=true;
		if(jQuery('#login_email').val()==""){
			
			var flag=false;
		}
		if(jQuery('#login_password').val()==""){
			
			flag=false;
		}
		return flag;
	}
	jQuery(document).ready(function(){
		jQuery('#login_cc').on("click",function(){
			login_cc();
		});
		jQuery('#login_email,#login_password').on("keyup",function(e){
			if(event.keyCode == 13){
		        $("#login_cc").click();
		       
		    }
		});
	});
	var login_cc=function(){
		if(validate()){
			var formdata={
				'username':jQuery('#login_email').val(),
				'password':jQuery('#login_password').val()
			};
			formdata=jQuery.param(formdata);
			jQuery('#login_cc').hide();
			jQuery('#login_loader').show();
			jQuery.post('https://www.sales1.vn/requests/login',{ data: formdata }, function(data) {

									//alert(data);
									var obj = jQuery.parseJSON(data);
									var success=obj.success;
									var msg=obj.msg;
									if(success==1)
									{
										jQuery('#processingBox').text(msg);
										jQuery('#processingBox').css('color','#006600');
										jQuery('#processingBox').css('text-align','center');
										if(obj.url){
											window.location.href=obj.url;
										}
										else{
											window.location.href=obj.url;
										}
										
									}
									else
									{
										
										alert(msg);
										jQuery('#login_loader').hide();
										jQuery('#login_cc').show();
										
									}});
		}
	}
	
	
}( window.login = window.login || {}, jQuery ));