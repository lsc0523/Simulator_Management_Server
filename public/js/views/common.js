import authService from '../services/rest/authService.mjs';


(function() {
    "use strict";

    $("#btn-logout").click(function(){
        
        confirm("Would you like to quit?") &&
        (function(){
            // $('#userform').submit();
            // localStorage.removeItem("saved_email")

            authService.logout()
            .then((res) => {
                console.log('logout success')
                window.location.href = "/login"
            })
            .catch((err) => {
                console.error(err);
                window.location.href = "/login"
            })
        })()
    });

    $("#ci").click(function(){
        window.location.href = "/page/dashboard/";
    })

})();