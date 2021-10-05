import noticeService from '../services/rest/noticeService.mjs';

var checkList ="";
var notice = {

    init : function(){   

    const table = $("#mgmt-tbody")

    noticeService.retrieve($("#sStartDate").val().replaceAll('-',''), $("#sEndDate").val().replaceAll('-',''))
        .then((datas) => {
            let innerHtml = '';
            if (datas && datas.length > 0) {
                datas.forEach((data, idx) => {
                    const today = moment(new Date()).format('YYYYMMDD');
                    const startDate = moment(new Date(data.start_date)).format('YYYYMMDD');
                    const endDate = moment(new Date(data.end_date)).format('YYYYMMDD');
                    const disp_yn = (today >= startDate && today <= endDate) ? '전시중': '종료';
                
                    innerHtml += `
                    <tr class="row-link" onclick='javascript:location.href="/page/mgmt/noticeForm?${data.id}";'>
                        <td  onclick="event.cancelBubble=true">
                        <div class="form-controls flex-center">
                            <span class="check style1">
                                <input type="checkbox" name="sFormBoard" id="sFormBoard${idx}" value="${data.id}">
                                <label for="sFormBoard${idx}"></label>
                            </span>
                        </div>
                        </td>
                        <td>${idx+1}</td>
                        <td>${data.type}</td>
                        <td class="align-l">${data.title}</td>
                        <td>${disp_yn}</td>
                        <td>${moment(data.start_date).format('YYYY-MM-DD')}</td>
                        <td>${moment(data.end_date).format('YYYY-MM-DD')}</td>
                        <td>${moment(data.created_date).format('YYYY-MM-DD HH:mm:ss')}</td>
                        <td>${data.author}</td>
                    </tr>
                    `
                });
            }
            else {
                innerHtml = `
                    <tr>
                        <td colspan="9">
                            <p class="nodata">조회된 목록이 없습니다.</p>
                        </td>
                    </tr>
                `
            }
            table.html(innerHtml)
        })
        .catch((err) => {
            console.error(err)
        })  
    }
    
}

$(function(){
    notice.init();
    $("#search").on('click',function(){
        notice.init();
        
    })
   
    $("#del").on('click',function(){
        checkList = "";
        $('input[name=sFormBoard]:checked').each(function(){
            checkList += this.value+",";
        })
        checkList = checkList.slice(0,-1);
        $(".type-confirm .popup-content").text("선택한 공지사항을 삭제하시겠습니까?");
        ui.popup.open('popupConfirm');
        
    })
    $("#confirm_act").on('click',function(){
        console.log("checkList:"+checkList.split(",").length);
        var chk = 0;
        if (checkList && checkList.length > 0) {
            for(var i=0; i<checkList.split(",").length; i++){
                noticeService.delete(checkList.split(",")[i])
                .then((data) => {
                    console.log(i+","+data)
                })
                .catch((err) => {
                    chk = 1
                    console.error(err)
                })
            }
        }
        if(chk == 0){
            $(".type-alert .popup-content").text("삭제 되었습니다.");
            ui.popup.open('popupAlert');

            notice.init();
        }
    })

        
});