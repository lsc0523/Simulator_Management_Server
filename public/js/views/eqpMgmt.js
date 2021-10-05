import remotePcService from '../services/rest/remotePcService.mjs';
import codeService from '../services/rest/codeService.mjs';

var eqp = {

    init : function(){   
    if($("#eqp_search").val() == '0'){
        $("#sFormCity").val('');
        $("#sFormLine").val('');
        $("#sFormProcell").val('');
        $("#sFormMachine").val('');
    }
    const table = $("#mgmt-tbody")
    var page = $("#page").val();
    var pageSize = 20;
    var idx = 1;

    var options = {
        region_id: $("#sFormCity").val(),
        line_id: $("#sFormLine").val(),
        cell_id: $("#sFormProcell").val(),
        machine_id: $("#sFormMachine").val(),
    }

    remotePcService.retrieve(page, options)
        .then((datas) => {
            $("#pageNum").val(datas.pageNum);
            let innerHtml = '';
            if (datas && datas.data.length > 0) {
                innerHtml = datas.data.reduce((inner, data) => {
                    
                    return inner += `
                    <tr class="row-link" onclick='javascript:view_pop_e(${data.id},"${data.region}","${data.line}","${data.cell}","${data.machine}","${data.domain}","${data.pc_id}","${data.pc_ip}","${data.pc_port}");'>
                        <td>${((page-1)*pageSize)+idx++}</td>    
                        <td>${data.region}</td>
                        <td>${data.line}</td>
                        <td>${data.cell}</td>
                        <td>${data.machine}</td>
                        <td>${data.domain}</td>
                        <td>${data.pc_id}</td>
                        <td>${data.pc_ip}</td>
                        <td>${data.pc_port}</td>
                        <td onclick="event.cancelBubble=true"><button type="button" class="btn btn-connect" onclick="location.href='/api/remotepc/${data.id}/connect'"><span>연결</span></button></td>
                        <td onclick="event.cancelBubble=true"><button type="button" class="btn btn-del" onclick="javascript:go_del_e(${data.id});"><span>삭제</span></button></td>
                        </td>
                    </tr>
                    `
                }, '')

            }
            else {
                innerHtml = `
                    <tr>
                        <td colspan="11">
                            <p class="nodata">조회된 목록이 없습니다.</p>
                        </td>
                    </tr>
                `
            }
            table.html(innerHtml)
            //paging 
            pagenation(page, datas.pageNum);
        })
        .catch((err) => {
            console.error(err)
        })
        if($("#idTxt_e").val() == ''){
            codeService.retrieve()
            .then((data) => {

                var str = "";
                if (data && data.length > 0) {
                    $.each(data, function(idx, code){
                        if(code.is_enabled == true && code.groupcode.groupcode == 'REGION'){
                            str += "<option value='" + code.id;
                            str += "'>" + code.name + "</option>";
                        }
                    })
                    if($("#eqp_search").val() != '1' && $("#sFormCity").val() == 0){
                        $("#sFormCity").html('<option value="">전체</option>' + str);
                    }
                    
                    $("#sPopLocal_e").html("");
                    $("#sPopLocal_e").html(str);

                    str = "";
                    $.each(data, function(idx, code){
                        if(code.is_enabled == true && code.groupcode.groupcode == 'LINE'){
                            str += "<option value=" + code.id;
                            str += ">" + code.name + "</option>";
                        }
                        
                    })                    
                    if($("#eqp_search").val() != '1' && $("#sFormLine").val() == 0){
                        $("#sFormLine").html('<option value="">전체</option>' + str);
                    }
                    $("#sPopLine").html("");
                    $("#sPopLine").html(`<option value="" selected>선택</option>`+str);

                    str = "";
                    $.each(data, function(idx, code){
                        if(code.is_enabled == true && code.groupcode.groupcode == 'CELL'){
                            str += "<option value=" + code.id;
                            str += ">" + code.name + "</option>";
                        }
                        
                    })
                    if($("#eqp_search").val() != '1' && $("#sFormProcell").val() == 0){
                        $("#sFormProcell").html('<option value="">전체</option>' + str);
                    }
                    $("#sPopProcell").html("");
                    $("#sPopProcell").html(`<option value="" selected>선택</option>`+str);

                    str = "";
                    $.each(data, function(idx, code){
                        if(code.is_enabled == true && code.groupcode.groupcode == 'MACH'){
                            str += "<option value=" + code.id;
                            str += ">" + code.name + "</option>";
                        }
                        
                    })
                    if($("#eqp_search").val() != '1' && $("#sFormMachine").val() == 0){
                        $("#sFormMachine").html('<option value="">전체</option>' + str);
                    }
                    $("#sPopMachine").html("");
                    $("#sPopMachine").html(`<option value="" selected>선택</option>`+str);

                    str = "";
                    $.each(data, function(idx, code){
                        if(code.is_enabled == true && code.groupcode.groupcode == 'DOMAIN'){
                            str += "<option value=" + code.id;
                            str += ">" + code.name + "</option>";
                        }
                        
                    })
                    $("#sPopDomain").html("");
                    $("#sPopDomain").html(str);
                }

            })
            .catch((err) => {
                console.error(err)
            })
        }
    }
}

$(function(){
    eqp.init();

    $("#save_e").on('click',function(){
        //유효성 체크
        var $b = $("#popupEquipReg");
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
            if($("#idTxt_e").val() == ''){
                var params = {
                    region_id: $("#sPopLocal_e").val(),
                    line_id: $("#sPopLine").val(),
                    cell_id: $("#sPopProcell").val(),
                    machine_id: $("#sPopMachine").val(),
                    domain_id: $("#sPopDomain").val(),
                    pc_id: $("#sPopID").val(),
                    pc_ip: $("#sPopIP").val(),
                    pc_port: $("#sPopPort").val()
                };

                remotePcService.create(params)
                .then((data) => {
                    $(".type-alert .popup-content").text("등록 되었습니다.");
                    ui.popup.open('popupAlert');
                    pop_reset_e();
                    ui.popup.close('popupEquipReg');
                    eqp.init();
                })
                .catch((err) => {
                    console.error(err)
                    $(".type-alert .popup-content").text("failed to create");
                    ui.popup.open('popupAlert');
                })
            }
            else{
                var params = {
                    region_id: $("#sPopLocal_e").val(),
                    line_id: $("#sPopLine").val(),
                    cell_id: $("#sPopProcell").val(),
                    machine_id: $("#sPopMachine").val(),
                    domain_id: $("#sPopDomain").val(),
                    pc_id: $("#sPopID").val(),
                    pc_ip: $("#sPopIP").val(),
                    pc_port: $("#sPopPort").val()
                };
                remotePcService.update($("#idTxt_e").val(),params)
                .then((data) => {
                    $(".type-alert .popup-content").text("수정 되었습니다.");
                    ui.popup.open('popupAlert');
                    eqp.init();
                })
                .catch((err) => {
                    console.error(err)
                    $(".type-alert .popup-content").text("failed to update");
                    ui.popup.open('popupAlert');
                })
            }
        }
        
    })
   
    $("#confirm_act_e").on('click',function(){
        remotePcService.delete($("#idTxt_e").val())
            .then((data) => {
                $(".type-alert .popup-content").text("삭제 되었습니다.");
                ui.popup.open('popupAlert');
                pop_reset();
                ui.popup.close('popupEquipReg');
                eqp.init();
            })
            .catch((err) => {
                console.error(err)
                $(".type-alert .popup-content").text("failed to delete");
                ui.popup.open('popupAlert');
            })
    })

     $("#go_eqp").on('click', function () {
        eqp.init();
    })
    $("#eqp_search").on('click', function () {
        $("#eqp_search").val("1");
        $("#page").val('1');
        eqp.init();
    })
});