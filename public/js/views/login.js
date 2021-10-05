import authService from '../services/rest/authService.mjs';

/**
 * @class login
 * @author Created by method76 on 2017. 1. 24
 */
document.onkeydown = function (e) {
    // 새로고침 방지
    var key = (e) ? e.keyCode : event.keyCode;
    var source = typeof (event) != 'undefined' ? (event.target || event.srcElement) : null;
    if ((key == 8 && source != '[object HTMLInputElement]') || key == 116) {
        if (e) {
            e.preventDefault();
        } else {
            event.keyCode = 0;
            event.returnValue = false;
        }
    } else if (key == 13) {
        $("#btn-login").click();
    }
}



/**
 * @function
 * @memberOf login
 * @param {object} name name
 */
function getParameters(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function CheckEmail(str) {
    
    console.log(`input : ${str}`);
    
    var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
     if(!reg_email.test(str)) {
          return false;
     }
     else {
          return true;
     }
}

function loginRequest(email, password, isSaveId, onError) {
    document.getElementById("login-err-msg").style = "color:#a50034";
    document.getElementById("login-err-msg").innerHTML = " ";
    var obEmail = document.getElementById("email");
    var obPassword = document.getElementById("password");

    if (email == null || email.length < 1) {
        document.getElementById("login-err-msg").innerHTML = "<span>!</span><p>ID(E-mail 주소)를 입력해 주세요.</p>";
        obEmail.focus();
        return;
    }
    else if(!CheckEmail(email)){
        document.getElementById("login-err-msg").innerHTML = "<span>!</span><p>ID(E-mail 주소)형식이 잘못되었습니다.</p>";
        obEmail.focus();
        return;
    }                

    if (password == null || password.length < 1) {
        // Materialize.toast('Please input your password', 2000);
        //alert('Please input your password');
        document.getElementById("login-err-msg").innerHTML = "<span>!</span><p>Password를 입력해 주세요.</p>";
        obPassword.focus();
        return;
    }

    authService.login(email, password)
        .then((data) => {
            // $("#mtd-progress-loader").removeClass('active');
            if (data && data.code === 200) {
                if (isSaveId) {
                    localStorage.setItem("saved_email", data.email)
                }
                else {
                    localStorage.removeItem("saved_email")
                }
                window.location.href = "/";
            }
        })
        .catch((err) => {
            document.getElementById("login-err-msg").innerHTML = "<span>!</span><p>ID 또는 Password가 잘못되었습니다.</p>";
            obEmail.focus();
            console.error(err);
        })
}

$(function () {

    $("#main-contents-wrapper").addClass("valign-wrapper");
    $("#main-contents-wrapper").css("overflow-x", "visible");
    $("#main-contents-wrapper").css("height", "100%");

    if (localStorage.getItem('saved_email') && localStorage.getItem('saved_email').length > 0) {
        $("#email").val(localStorage.getItem('saved_email'));
    }

    $("#btn-login").click(function () {
        window.location.href = "/";
        /*
        loginRequest($("#email").val(), $("#password").val(), $("#sLoginCheck").is(":checked"),
        () => {
            $("#login-err-msg").addClass("is-failed");
        })
        */
    });

    $("#email").focus();

    

});
