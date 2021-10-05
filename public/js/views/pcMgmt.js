import pcService from '../services/rest/pcService.mjs';
import codeService from '../services/rest/codeService.mjs';

var pcMgmt = {

    init : function(){   

        const userTable = $("#data-list")
        var page =  $("#page").val();
        var pageSize = 20;
        var idx = 1;

        const param = {
            schSteCdIdxNo : $("#schSite").val()
        }
        
        pcService.retrieveAll(page, param)
            .then((datas) => {   
                
                $("#pageNum").val(datas.pageNum);
                let innerHtml = '';
                if (datas && datas.data) {
                    innerHtml = datas.data.reduce((inner, data) => {                       
                        return inner += `
                        <tr class="row-link"  onclick='javascript:pcview_pop(${data.idx_no},${data.site_idx_no},"${data.pc_nm}","${data.pc_ip}","${data.loc_desc}");'>
                            <td>${((page-1)*pageSize)+idx++}</td>                            
                            <td>${data.cmn_cd}</td>
                            <td>${data.pc_nm}</td>
                            <td>${data.pc_ip}</td>
                            <td>${data.rgst_nm}</td>
                            <td>${data.upus_nm === null ? '' : data.upus_nm}</td>
                            <td>${data.loc_desc}</td>                            
                            <td>
                                <div>
                                ${data.del_yn === '0' ? 
                                    `<button type="button" class="btn btn-del" data-index="${data.idx_no}" id="del_${data.idx_no}"><span>삭제</span></button>` : '' }
                                </div>
                            </td>
                        </tr>
                        `
                    }, '')

                }
                else {
                    innerHtml = `
                        <tr>
                            <td colspan="7">
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
    },
    del : function(id, e) {    
        
        pcService.delete(id)
        .then((data) => {        
            ui.popup.close('popupSimulPCReg');          
            $(".type-alert .popup-content").text("삭제 되었습니다.");
            ui.popup.open('popupAlert');              
            this.init();
        })
        .catch((err) => {
            console.error(err)
            ui.popup.close('popupSimulPCReg');
            $(".type-alert .popup-content").text("failed to delete");
            ui.popup.open('popupAlert');
        })  
    },    
    codeRetieve : function(codeId){
        
		codeService.retrieve(codeId)
        .then(datas => {         
            let innerSite = '';
            if (datas && datas.length > 0) {
                // 셀렉트 박스에 값 세팅
                innerSite = datas.reduce((inner, data) => {                        
                    if(data.use_yn === '1' &&  data.cmn_cd !== "COMMON"){
                         inner += `<option value='${data.idx_no}'>${data.cmn_cd}</option>`;
                    }   
                    return inner;                                     
                }, '');
            } 

            $("#schSite").append(innerSite);
            $("#popupSimulPCReg #popSite").html(innerSite);
        })
        .catch((err) => {
            console.error(err);
        })
    }

}

$(function(){
    pcMgmt.codeRetieve('SITE');  
    pcMgmt.init();


    $("#btnSearch").on('click',function(){
        $("#page").val('1');
        pcMgmt.init();
    })

    $(document).on('click', '[id^="del_"]', function(e){
       
        if(confirm("정말 삭제하시겠습니까?")){                      
            pcMgmt.del($(this).data('index'));           
        }else{
            ui.popup.close('popupSimulPCReg'); 
        }
       
    });

    $("#pcSave").on('click',function(){
        //유효성 체크
        var $b = $("#popupSimulPCReg input");
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
            if($("#popupSimulPCReg #popSimulIdxNo").val() == ''){
                var params = {                    
                        ste_cd_idx_no: $("#popSite").val(),
                        pc_nm: $("#popPcNm").val(),
                        pc_ip : $("#popPcIp").val(),
                        loc_desc : $("#popLocDesc").val(),
                        rgst_nm : $("#popRgstNm").val()                     
                };
                
                $("#pcSave").prop("disabled", true);
                FunLoadingBarStart();
                pcService.create( params)
                .then((data) => {
                    $("#pcSave").prop("disabled", false);
                    FunLoadingBarEnd();
                    ui.popup.close('popupSimulPCReg');
                    $(".type-alert .popup-content").text("등록 되었습니다.");
                    ui.popup.open('popupAlert');
                    pop_pc_reset();                                        
                    pcMgmt.init();
                })
                .catch((err) => {
                    console.error(err)
                    $("#pcSave").prop("disabled", false);
                    FunLoadingBarEnd();
                    $(".type-alert .popup-content").text("failed to create");
                    ui.popup.open('popupAlert');
                })
            }
            else{
                var params = {
                    ste_cd_idx_no: $("#popSite").val(),
                    pc_nm: $("#popPcNm").val(),
                    pc_ip : $("#popPcIp").val(),
                    loc_desc : $("#popLocDesc").val(),                    
                    upus_nm : $("#popUpusNm").val()    
                };
                $("#pcSave").prop("disabled", true);
                FunLoadingBarStart();
                pcService.update($("#popSimulIdxNo").val(), params)
                .then((data) => {
                    $("#pcSave").prop("disabled", false);
                    FunLoadingBarEnd();
                    ui.popup.close('popupSimulPCReg');
                    $(".type-alert .popup-content").text("수정 되었습니다.");
                    pop_pc_reset();  
                    ui.popup.open('popupAlert');
                    pcMgmt.init();
                })
                .catch((err) => {
                    console.error(err)
                    $("#pcSave").prop("disabled", false);
                    FunLoadingBarEnd();
                    $(".type-alert .popup-content").text("failed to update");
                    ui.popup.open('popupAlert');
                })
            }
        }
        
    })
    $("#page").on('click',function(){
        pcMgmt.init();
    })
   
})
;

