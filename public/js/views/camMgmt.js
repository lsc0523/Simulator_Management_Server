import camService from '../services/rest/camService.mjs';
import codeService from '../services/rest/codeService.mjs';
//const { tableName } = require("../../../node_app/models/CodeModel");

var cam = {
    init : function(){
    if($("#cam_search").val() == '0'){
        $("#sFormCity_c").val('');
    }
    const tableName = $("#cam-tbody");
    var page = $("#page").val();
    var pageSize = 20;
    var idx = 1;
        
    var s_region = $("#sFormCity_c").val();
    if(typeof s_region == "undefined" || s_region == "" || s_region == null){
        s_region = ''
    }
    camService.retrieve(page, s_region)
        .then((datas) => {
            $("#pageNum").val(datas.pageNum);
            let innerHtml = '';
            if(datas && datas.data.length > 0){
                innerHtml = datas.data.reduce((inner, data) => {
                        return inner += `
                        <tr class="row-link" onclick='javascript:view_pop_c(${data.id},"${data.region}","${data.cam_name}","${data.cam_description}","${data.displayed_cam_url}","${data.cam_id}");'>
                            <td>${((page-1)*pageSize)+idx++}</td>
                            <td>${data.region}</td>
                            <td >${data.cam_name}</td>
                            <td>${data.cam_description}</td>
                            <td>${data.displayed_cam_url}</td>
                            <td onclick="event.cancelBubble=true"><button type="button" class="btn btn-connect" onclick='go_connect_c("${data.id}");'><span>연결</span></button></td>
                            <td onclick="event.cancelBubble=true"><button type="button" class="btn btn-del" onclick="go_del_c('${data.id}');"><span>삭제</span></button></td>
                        </tr>
                        `
                    }, '')
            }else{
                innerHtml = `
                <tr>
                    <td colspan="7">
                        <p class="nodata">조회된 목록이 없습니다.</p>
                    </td>
                </tr>
                `
            }
            tableName.html(innerHtml);
            //paging 
            pagenation(page, datas.pageNum);

        })
        .catch((err) => {
            console.error(err);
        });
        if($("#idTxt_c").val() == ''){
            codeService.retrieve()
            .then((data) => {
                var str ="";
                if(data && data.length > 0){
                    $.each(data, function(idx, code){
                        if(code.is_enabled == true && code.groupcode.groupcode == 'REGION'){
                            str += "<option value='" + code.id;
                            str += "'>" + code.name + "</option>";
                        }
                    })
                    
                    if (($("#cam_search").val() != '1') && ($("#sFormCity_c").val() == 0)) {
                        $("#sFormCity_c").html('<option value="">전체</option>' + str);
                    }

                    $("#sPopLocal_c").html("");
                    $("#sPopLocal_c").html(str);
                }

            }).catch((err) =>{
                console.error(err);
            })
        }
    }
}
    
$(function(){
    cam.init();
    $("#saveCam").on('click',function(){
        //유효성 체크
        var $b = $("#popupCamReg");
        var $t, t;
        var result = true;
        
        $b.find("input").each(function(i) {
            $t = jQuery(this);
            if($t.prop("required")) {
                if(!jQuery.trim($t.val())) {
                    t = jQuery("label[for='"+$t.attr("id")+"']").text();
                    result = false;
                    $t.focus();
                    $(".type-alert .popup-content").text(t+"은(는) 필수 입력입니다.");
                    ui.popup.open('popupAlert');
                    return;
                }
            }
        });

        if(result){
            
            if($("#sPopPW_c").val() != $("#sPopPW2_c").val()){
                $(".type-alert .popup-content").text("패스워드가 일치하지 않습니다.");
                ui.popup.open('popupAlert');
                return;
            }

            if($("#idTxt_c").val() == ''){
                
                var params = {
                    region_id: $("#sPopLocal_c").val(),
                    cam_name: $("#sPopNicname_c").val(),
                    cam_description: $("#sPopSummary").val(),
                    cam_url: ":"+ $("#sPopPW_c").val()+"@",
                    displayed_cam_url: $("#sPopURL").val(),
                    cam_id: $("#sPopID_c").val(),
                    password: $("#sPopPW_c").val(),
                    password_confirm: $("#sPopPW2_c").val(),
                    
                };
                camService.create(params)
                .then((data) => {
                    $(".type-alert .popup-content").text("등록 되었습니다.");
                    ui.popup.open('popupAlert');
                    pop_reset_c();
                    ui.popup.close('popupCamReg');
                    cam.init();
                })
                .catch((err) => {
                    console.error(err)
                    $(".type-alert .popup-content").text("failed to create");
                    ui.popup.open('popupAlert');
                })
            }
            else{
                var params = {
                    region_id: $("#sPopLocal_c").val(),
                    cam_name: $("#sPopNicname_c").val(),
                    cam_description: $("#sPopSummary").val(),
                    cam_url: ":"+ $("#sPopPW_c").val()+"@",
                    displayed_cam_url: $("#sPopURL").val(),
                    cam_id: $("#sPopID_c").val(),
                    password: $("#sPopPW_c").val(),
                    password_confirm: $("#sPopPW2_c").val(),
                };
                if(!$("#sOptionCheck").prop("checked")){
                    delete params.cam_url;
                }
                camService.update($("#idTxt_c").val(),params)
                .then((data) => {
                    $(".type-alert .popup-content").text("수정 되었습니다.");
                    ui.popup.open('popupAlert');
                    pop_reset_c();
                    ui.popup.close('popupCamReg');
                    cam.init();
                })
                .catch((err) => {
                    console.error(err)
                    $(".type-alert .popup-content").text("failed to update");
                    ui.popup.open('popupAlert');
                })
            }
        }
        
    })
    $("#sOptionCheck").on('click',function(){
        if($("#sOptionCheck").prop("checked")){
            $(".r_area").css("display",'');
        }else{
            $(".r_area").css("display",'none');
        }
    })
    $("#confirm_act_c").on('click',function(){
        camService.delete($("#idTxt_c").val())
            .then((data) => {
                $(".type-alert .popup-content").text("삭제 되었습니다.");
                ui.popup.open('popupAlert');
                pop_reset();
                ui.popup.close('popupCamReg');
                cam.init();
            })
            .catch((err) => {
                console.error(err)
                $(".type-alert .popup-content").text("failed to delete");
                ui.popup.open('popupAlert');
            })
    })
    $("#go_cam").on('click',function(){
        cam.init();
    })

    $("#cam_search").on('click', function () {
        $("#cam_search").val("1");
        $("#page").val('1');
        cam.init();
    })
});
