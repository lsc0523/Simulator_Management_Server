import codeService from '../services/rest/codeService.mjs';
import grpCodeService from '../services/rest/groupCodeService.mjs';


var code = {

    init : function(){    
        const userTable = $("#data-list")
        var page =  $("#page").val();
        var pageSize = 20;
        var idx = 1;
        codeService.retrieveAll($("#schGrCd").val(), page)
            .then((datas) => {      
               
                $("#pageNum").val(datas.pageNum);
                let innerHtml = '';
                if (datas && datas.data) {
                    innerHtml = datas.data.reduce((inner, code) => {
                        return inner += `
                        <tr class="row-link" onclick='javascript:view_pop(${code.idx_no},"${code.cmn_cd}","${code.cmn_cd_nm}",
                        ${code.use_yn},"${code.groupcode.gr_cd}","${code.groupcode.gr_cd_nm}");'>
                            <td>${((page-1)*pageSize)+idx++}</td>
                            <td>${code.groupcode.gr_cd}</td>
                            <td>${code.groupcode.gr_cd_nm}</td>
                            <td>${code.cmn_cd}</td>
                            <td>${code.cmn_cd_nm}</td>
                            <td>${code.use_yn === "1" ? "사용중" : "사용안함"}</td>
                        </tr>
                        `
                    }, '')

                }
                else {
                    innerHtml = `
                        <tr>
                            <td colspan="6">
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
    , search_set : function (name){
        $("#popSchGrCdNm").val(name);
		const userTable = $("#grpList")

        grpCodeService.retrieveAll()
            .then((datas) => {

                let innerHtml = '';
                if (datas && datas.length > 0) {
                    //var groupcde = datas;
                    datas.forEach((groupcode, idx) => {
                        if(groupcode.use_yn == true){
                            if(name != '' && name != undefined){
                                if(name == groupcode.gr_cd_nm){
                                    innerHtml = `
                                        <tr class="row-link" onclick="choose_set(${groupcode.idx_no},'${groupcode.gr_cd}','${groupcode.gr_cd_nm}');">
                                            <td>1</td>
                                            <td>${groupcode.gr_cd}</td>
                                            <td >${groupcode.gr_cd_nm}</td>
                                        </tr>
                                    `
                                }
                            }else{
                                innerHtml += `
                                <tr class="row-link" onclick="choose_set(${groupcode.idx_no},'${groupcode.gr_cd}','${groupcode.gr_cd_nm}');">
                                    <td>${idx+1}</td>
                                    <td>${groupcode.gr_cd}</td>
                                    <td>${groupcode.gr_cd_nm}</td>
                                </tr>
                                `
                            }
                        }
                        
                    });
                    
                }else{
                    innerHtml = `
                        <tr>
                            <td colspan="3">
                                <p class="nodata">조회된 목록이 없습니다.</p>
                            </td>
                        </tr>
                    `
                }
                if(innerHtml == ''){
                    innerHtml = `
                    <tr>
                        <td colspan="3">
                            <p class="nodata">조회된 목록이 없습니다.</p>
                        </td>
                    </tr>
                    `
                }
               
                userTable.html(innerHtml)
            })
            .catch((err) => {
                console.error(err)
            })
    }    
}

$(function(){
    code.init();
    
    $("#schGrCdNm").on("keyup",function(){
        var cont= $(this).val();
        if(cont.replace(/\s/g,"").length==0){
            $("#schGrCd").val('')
        }
    })

    $("#codeSave").on('click',function(){

        //유효성 체크
        var $b = $("#popupGroupReg input");
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
                    cmn_cd: $("#popCmnCd").val(),
                    cmn_cd_nm: $("#popCmnCdNm").val(),
                    gr_idx_no: $("#popGrIdxNo").val(),
                    use_yn: $("#popUseYn").val()                    
                };
                
                $("#codeSave").prop("disabled", true);
                FunLoadingBarStart();
                codeService.create(params)
                .then((data) => {                    
                    if(data.code == 300) {
                        $("#codeSave").prop("disabled", false);
                        FunLoadingBarEnd();
                        $(".type-alert .popup-content").text("이미 등록된 코드 입니다.");
                        ui.popup.open('popupAlert');
                    }else{
                        $("#codeSave").prop("disabled", false);
                        FunLoadingBarEnd();
                        $(".type-alert .popup-content").text("등록 되었습니다.");
                        ui.popup.open('popupAlert');
                        pop_reset();
                        ui.popup.close('popupGroupReg');
                        code.init();
                    }
                    
                })
                .catch((err) => {
                    console.error(err)
                   // console.log(err.code);
                    
                   
                    $("#codeSave").prop("disabled", false);
                    FunLoadingBarEnd();
                    $(".type-alert .popup-content").text("failed to create");
                    ui.popup.open('popupAlert');                   
                    
                })
            }
            else{
                var params = {
                    cmn_cd_nm: $("#popCmnCdNm").val(),
                    use_yn: $("#popUseYn").val()                   
                };
                $("#codeSave").prop("disabled", true);
                FunLoadingBarStart();
                codeService.update($("#popIdxNo").val(),params)
                .then((data) => {
                    $("#codeSave").prop("disabled", false);
                    FunLoadingBarEnd();
                    $(".type-alert .popup-content").text("수정 되었습니다.");
                    ui.popup.open('popupAlert');
                    ui.popup.close('popupGroupReg');
                    code.init();
                })
                .catch((err) => {
                    console.error(err)
                    $("#codeSave").prop("disabled", false);
                    FunLoadingBarEnd();
                    $(".type-alert .popup-content").text("failed to update");
                    ui.popup.open('popupAlert');
                })
            }
        }
        
    })
    $(".gSearch").on('click',function(){
        if($(this).attr("value") == 'listSearch'){
            $("#listSearchYn").val('Y');
        }
        
        ui.popup.open('popupGroupList');
        code.search_set($(this).siblings("input").val());
    })
    $("#gSearchBtn").on('click',function(){
        code.search_set($("#popSchGrCdNm").val());
    })
    $("#listSearch").on('click',function(){
        $("#page").val('1');
        code.init();
    })
    $("#page").on('click',function(){
        code.init();
    })
});

