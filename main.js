

//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log('[Apps] : init() called');
    
    //window.addEventListener('appcontrol', onAppControlReceived);
    onAppControlReceived();
    
    console.log('[Apps] : exit app.');
    tizen.application.getCurrentApplication().exit();
    
    
    document.addEventListener('visibilitychange', function() {
        if(document.hidden){
            // Something you want to do when hide or exit.
        } else {
            // Something you want to do when resume.
        }
    });
 
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: //LEFT arrow
    		break;
    	case 38: //UP arrow
    		break;
    	case 39: //RIGHT arrow
    		break;
    	case 40: //DOWN arrow
    		break;
    	case 13: //OK button
    		break;
    	case 10009: //RETURN button
		tizen.application.getCurrentApplication().exit();
    		break;
    	default:
    		console.log('[Apps] :  Key code : ' + e.keyCode);
    		break;
    	}
    });
};


function onAppControlReceived() {
	console.log('[Apps][Main.js] : onAppControlReceived');
    // var reqAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();
    if (reqAppControl && reqAppControl.appControl !== null) {
    	console.log("[Apps][Main.js]  [length]=[" + reqAppControl.appControl.data.length + "]");
        console.log("[Apps][Main.js]  [data]=" + JSON.stringify(reqAppControl.appControl.data));
        
        var payloadValue = '';
		var previewAppid = '';
        for (var i = 0; i < reqAppControl.appControl.data.length; i++) {
            var fileId = undefined;
            console.log("[Apps][Main.js] data[" + i + "] key=" + JSON.stringify(reqAppControl.appControl.data[i].key) + " value=" + JSON.stringify(reqAppControl.appControl.data[i].value));

            if (reqAppControl.appControl.data[i].key === "PAYLOAD") {
                payloadValue = reqAppControl.appControl.data[i].value[0];
				payloadValue = JSON.parse(payloadValue);
				console.log("[Apps][Main.js] payloadValue=" + JSON.stringify(payloadValue));
				if(payloadValue !== null && payloadValue.values !== null){
					previewAppid = payloadValue.values;
					console.log("[Apps][Main.js] previewAppid=" + JSON.stringify(previewAppid));
				}	
            }
        }
        
        
        if(previewAppid !== null && previewAppid !== ''){
        	//var appInfo = window.tizen.application.getAppInfo(previewAppid);
        	var appinfo = null;
        	try {
        		console.log("[Apps][Main.js] previewAppid : " + previewAppid);
        		appinfo = webapis.was.getAppInfo(previewAppid);
        		console.log("[Apps][Main.js] appinfo : " + JSON.stringify(appinfo));
        		appinfo = JSON.parse(appinfo);
        		console.log("[Apps][Main.js] appTizenId = " + appInfo.appTizenId);  
        	} catch (error) {
        		console.error("[Apps][Main.js] error code = " + error.code);
        	}
        	
        	if(appinfo !== null){
        		//case 1 : launch the preview app
        		console.log("[Apps][Main.js] launch app : " + previewAppid);
        		window.tizen.application.launch(previewAppid);
        		console.log("[Apps][Main.js] launch app end");
        	}else{
        		//case 2 : deeplink to Apps detail
            	console.log("[Apps][Main.js] deeplink to Apps detail : " + JSON.stringify(previewAppid));
                var appControlData1 = new tizen.ApplicationControlData('Sub_Menu', ['detail']);
                var appControlData2 = new tizen.ApplicationControlData('widget_id',[previewAppid]);
                var deepAppControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/view', null, null, null, [appControlData1,appControlData2]);
                var appId = "org.tizen.factory";
                window.tizen.application.launchAppControl(deepAppControl,appId);
                console.log("[Apps][Main.js] deeplink to Apps detail End");
        	} 
            
        }else {
        	//case 3 : deeplink to Apps PUBLICTV list
            console.log("[Apps][Main.js] deeplink to Apps PUBLICVALUE list");
            var appControlData1 = new tizen.ApplicationControlData('Sub_Menu', ['main']);
            var appControlData2 = new tizen.ApplicationControlData('category_id',['PUBLICVALUE']);
            var deepAppControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/view', null, null, null, [appControlData1,appControlData2]);
            var appId = "org.tizen.factory";
            window.tizen.application.launchAppControl(deepAppControl,appId);
            console.log("[Apps][Main.js] deeplink to Apps PUBLICTV list End");
		}

        
    }else {
        console.error('[Apps:onAppControlReceived()] appControl is not currect.');
    }
    

}

//window.onload can work without <body onload="">
window.onload = init;