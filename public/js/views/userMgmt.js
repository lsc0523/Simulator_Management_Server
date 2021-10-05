import userAuthService from '../services/rest/userAuthService.mjs';
import codeService from '../services/rest/codeService.mjs';

var userAuth = {

    init : function(){   

        const userTable = $("#data-list")
        // if($("#user_search").val() == '0'){
        //     $("#sFormId").val('');
        //     $("#sFormNick").val('')
        //     $("#sFromlLocal").val('')
        // }
        
        //remote 메뉴로 접근했는지, 사이트 관리로 접근했는지 구분
        var type = 'M'

        if(window.location.href.indexOf('remote')>-1){
            type = 'O';
        }
        var page =  $("#page").val();
        var pageSize = 20;
        var idx = 1;
        var options = {
            srchAuth: $("#srchAuth").val(),
            srchId: $("#srchId").val(),
            srchEmpNm: $("#srchEmpNm").val()
        }
        userAuthService.retrieveAll(options, page)
            .then((datas) => {
                
                $("#pageNum").val(datas.pageNum);
                let innerHtml = '';
                if (datas && datas.data) {
                    
                    innerHtml = datas.data.reduce((inner, user) => {
                        console.log(user);
                        return inner += `
                        <tr class="row-link"  onclick='javascript:userAuth_view_pop(${user.idx_no},"${user.auth_cd_idx_no}", "${user.user_id}","${user.emp_nm}", "${user.org_nm}", "${user.emp_no}");'>                       
                            <td>${user.auth_nm}</td>
                            <td>${user.user_id}</td>
                            <td>${user.emp_nm}</td>
                            <td>${user.org_nm}</td>                        
                        </tr>
                        `
                    }, '')

                }
                else {
                    innerHtml = `
                        <tr>
                            <td colspan="4">
                                <p class="nodata">조회된 목록이 없습니다.</p>
                            </td>
                        </tr>
                    `
                }
                userTable.html(innerHtml)
                //paging 
                pagenation(page, datas.pageNum);
                
            })
            .catch((err) => {
                console.error(err)
            })
            
    }
    ,authSelect : function(groupCodeId){
        
		codeService.retrieve(groupCodeId)
        .then(datas => {            
            let innerSite = '';
            if (datas && datas.length > 0) {
                // 셀렉트 박스에 값 세팅
                innerSite = datas.reduce((inner, curr, idx) => {                        
                    return inner += `<option value='${curr.idx_no}'>${curr.cmn_cd_nm}</option>`;                    
                }, '');
            } 

            $("#srchAuth").append(innerSite);
            $("#popAuth").html(innerSite);
        })
        .catch((err) => {
            console.error(err);
        })
    }
}

$(function(){
    userAuth.authSelect('AUTH');  
    userAuth.init();
    
    $("#userSave").on('click',function(){
        //유효성 체크
        var $b = $("#popupUserAuthority input");
        var $t, t;
        var result = true;
        
        $b.each(function(i, item) {
                        
            if($(item).prop("required")) {
                if(!jQuery.trim($(item).val())) {
                    t = jQuery("label[for='"+$(item).prop("id")+"']").text();
                    result = false;
                    $(item).focus();
                    $(".type-alert .popup-content").text(t+"은(는) 필수 입력입니다.");
                    ui.popup.open('popupAlert');
                    return false;
                }
            }
        });

        if(result){    
            
            if($("#popIdxNo").val() == ''){
                
                var params = {
                    auth_cd_idx_no: $("#popAuth").val(),
                    user_id: $("#popId").val(),
                    emp_no : $("#popEmpNo").val(),
                    emp_nm : $("#popEmpNm").val(),
                    org_nm: $("#popOrgNm").val(),
                    rgst_nm : $("#popAuthRgstNm").val()
                };

                FunLoadingBarStart();
                userAuthService.create(params)
                .then((data) => {
                    if(data.code == 300) {
                        FunLoadingBarEnd();
                        $(".type-alert .popup-content").text("이미 등록된 ID 입니다.");
                        ui.popup.open('popupAlert');
                    }else{
                        FunLoadingBarEnd();
                        $(".type-alert .popup-content").text("등록 되었습니다.");
                        ui.popup.open('popupAlert');
                        userAuth_pop_reset();
                        ui.popup.close('popupUserAuthority');
                        userAuth.init();
                    }
                })
                .catch((err) => {
                    console.error(err)
                    FunLoadingBarEnd();
                    $(".type-alert .popup-content").text("failed to create");
                    ui.popup.open('popupAlert');
                })
            }
            else{
                var params = {
                    auth_cd_idx_no: $("#popAuth").val(),        
                    upus_nm : $("#popAuthUpusNm").val()   
                  
                };
                FunLoadingBarStart();
                userAuthService.update($("#popIdxNo").val(),params)
                .then((data) => {
                    FunLoadingBarEnd();
                    $(".type-alert .popup-content").text("수정 되었습니다.");
                    ui.popup.open('popupAlert');
                    userAuth_pop_reset();
                    ui.popup.close('popupUserAuthority');
                    userAuth.init();
                })
                .catch((err) => {
                    console.error(err)
                    FunLoadingBarEnd();
                    $(".type-alert .popup-content").text("failed to update");
                    ui.popup.open('popupAlert');
                })
            }
        }
        
    })
    
    $("#page").on('click',function(){
        userAuth.init();
    })

    $("#btnSearch").on('click', function () {        
        $("#page").val('1');
        userAuth.init();
    })

    $("#popSearchId").on('click', function(){
        if($("#popId").val() === ''){
            $("#popId").focus();
            $(".type-alert .popup-content").text("ID를 입력해주세요.");
            ui.popup.open('popupAlert');
            return false;
        }else{
           userAuthService.retrieveId($("#popId").val())
           .then((data) => {                
                if(data.length > 0){
                    if(data[0].insId > 0){
                        $(".type-alert .popup-content").text("이미 등록된 ID 입니다.");
                        ui.popup.open('popupAlert');    
                        $("#popEmpNo").val('');
                        $("#popEmpNm").val('');
                        $("#popOrgNm").val('');
                        return false;
                    }else{
                        $("#popEmpNo").val(data[0].emp_no);
                        $("#popEmpNm").val(data[0].emp_nm);
                        $("#popOrgNm").val(data[0].org_nm);
                    }                    
                }else{
                    $(".type-alert .popup-content").text("조회된 데이터가 없습니다.");
                    ui.popup.open('popupAlert');    
                    $("#popEmpNo").val('');
                    $("#popEmpNm").val('');
                    $("#popOrgNm").val('');
                    return false;
                }            
            })
            .catch((err) => {
                console.error(err)
                $(".type-alert .popup-content").text("failed to update");
                ui.popup.open('popupAlert');
            })
        }
    })
});