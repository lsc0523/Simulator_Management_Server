import noticeService from '../services/rest/noticeService.mjs';
import codeService from '../services/rest/codeService.mjs';

var notice = {

    init : function(){   
        var url = window.location.href;
        var n_id = url.split('?')[1] ;

        var str = "";
        codeService.retrieve('NOTI_TYPE')   //공지유형 데이터 변경되면 id 확인하여 수정해야 함!!!
            .then((data) => {
                console.log("data"+data)
                data.forEach((tcode, idx) => {
                    console.log("tcode:"+tcode)

                    if(tcode.is_enabled == true){
                        str += "<option value='" + tcode.id;
                        str += "'>" + tcode.name + "</option>";
                    }
                });
                $("#sFormType").html("");
                $("#sFormType").html(str);
            })
            .catch((err) => {
                console.error(err)
            })

        if(n_id != null && n_id != ''){
            noticeService.retrieveOne(n_id)
            .then((data) => {
                $("#idTxt").val(data.id);
                $("#sFormType option").filter(function() {return this.text == data.type;}).prop('selected', 'selected');
                $("#sFormTit").val(data.title);
                $("#sFormText").text(data.text.replace(/(<br>|<br\/>|<br \/>)/g, '\r\n'));
                $("#sFormStart").val(data.start_date.substring(0,10));
                $("#sFormEnd").val(data.end_date.substring(0,10));
                if(data.start_date.substring(0,10) != '1999-01-01'){
                    $("#data_area").css("display",'block');  
                    $("#set_area").css("display",'none');  
                    $("#sCheckSet").prop("checked",true);
                }
            })
            .catch((err) => {
                console.error(err)
                $(".type-alert .popup-content").text("데이터를 가져오는 데 실패하였습니다.");
                ui.popup.open('popupAlert');
            })
        }
    }
}

$(function(){
    $("#content").removeClass('board-content');
    $("#content").addClass('board-content2');
    notice.init();
    $("#save").on('click',function(){

        //유효성 체크
        var $b = $("*");
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
        if($("#sFormText").val().trim() == ''){
            result = false;
            $("#sFormText").val('');
            $("#sFormText").focus();
            $(".type-alert .popup-content").text("공지내용은 필수 입력입니다.");
            ui.popup.open('popupAlert');
            return;
        }
        if($("#sCheckSet").prop("checked") ){
            if($("#sFormStart").val() == '' ||  $("#sFormEnd").val()== ''){
                $(".type-alert .popup-content").text("전시기간 설정하실 경우 시작일자와 종료일자 모두 입력하셔야 합니다.");
                ui.popup.open('popupAlert');
                result = false;
                return;
            }else{
                if($("#sFormStart").val().replaceAll('-','') > $("#sFormEnd").val().replaceAll('-','')){
                    $(".type-alert .popup-content").text("전시 시작일자가 종료일자보다 클 수 없습니다.");
                    ui.popup.open('popupAlert');
                    result = false;
                    return;
                }
            }
                
        }
        if(result){
            if($("#idTxt").val() == ''){
                $(".type-confirm .popup-content").text("등록하시겠습니까?");
            }else{
                $(".type-confirm .popup-content").text("수정하시겠습니까?");
            }
            
            ui.popup.open('popupConfirm');
        }
        
    })
    
    $("#confirm_act").on('click',function(){
        
        var date1 = $("#sFormStart").val()=="" ? "1999-01-01" :$("#sFormStart").val();    
        var date2 = $("#sFormEnd").val()=="" ? "2999-12-31" :$("#sFormEnd").val();  
        console.log("data1:"+date1+"  data2:"+date2)

        if($("#idTxt").val() == ''){
     
            var params = {
                type_id: $("#sFormType").val(),
                title: $("#sFormTit").val(),
                text: $("#sFormText").val().replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/"/g, '`').replace(/'/g, '`'),
                start_date: date1,
                end_date: date2
                
            };
            noticeService.create(params)
            .then((data) => {
                $(".type-alert .popup-content").text("등록 되었습니다.");
                ui.popup.open('popupAlert');
                setTimeout("location.href='/page/mgmt/noticeMgmt'", 1000);
            })
            .catch((err) => {
                console.error(err)
                $(".type-alert .popup-content").text("failed to create");
                ui.popup.open('popupAlert');
            })
        }
        else{
            var params = {
                type_id: $("#sFormType").val(),
                title: $("#sFormTit").val(),
                text: $("#sFormText").val().replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/"/g, '`').replace(/'/g, '`'),
                start_date: date1,
                end_date: date2
            };
            noticeService.update($("#idTxt").val(),params)
            .then((data) => {
                $(".type-alert .popup-content").text("수정 되었습니다.");
                ui.popup.open('popupAlert');
                setTimeout("location.href='/page/mgmt/noticeMgmt'", 1000);

            })
            .catch((err) => {
                console.error(err)
                $(".type-alert .popup-content").text("failed to update");
                ui.popup.open('popupAlert');
            })
        }
        
    })
    $("#sCheckSet").on('click',function(){
        if($("#sCheckSet").prop("checked")){
            $("#data_area").css("display",'block');  
            $("#set_area").css("display",'none');  
        }else{
            $("#data_area").css("display",'none');  
            $("#set_area").css("display",'block');  
            $("#sFormStart").val('');
            $("#sFormEnd").val('');  
        }
        
    })
    
});