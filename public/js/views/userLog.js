import userLogService from '../services/rest/userLogService.mjs';

var userLog = {

    init : function(){   

        const userTable = $("#data-list");
        var page =  $("#page").val();
        var pageSize = 20;
        var idx = 1;
        var options = {
            schStDt : $("#schStDt").val().replaceAll('-', ''),
            schEndDt : $("#schEndDt").val().replaceAll('-', '')
        };

        userLogService.retrieveAll(options, page)
            .then((datas) => {
            
                $("#pageNum").val(datas.pageNum);
                let innerHtml = '';
                if (datas && datas.data.length > 0) {                   
                    innerHtml = datas.data.reduce((inner, user) => {
                        
                        return inner += `
                        <tr> 
                            <td>${moment(user.reg_dtm).format('YYYY-MM-DD HH:mm:ss')}</td>
                            <td>${user.rgst_id}</td>
                            <td>${user.log_ctn}</td>                            
                        </tr>
                        `
                    }, '')

                }
                else {
                    innerHtml = `
                        <tr>
                            <td colspan="3">
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
}

$(function(){
    userLog.init();
    
    $("#page").on('click',function(){
        userLog.init();
    })

    $("#btnSearch").on('click', function () {    
        if($("#schStDt").val()){
            if(!$("#schEndDt").val()){
                alert("검색기간의 시작일 ~ 종료일을 선택하세요.");
                return false;
            }            
        }

        if($("#schEndDt").val()){
            if(!$("#schStDt").val()){
                alert("검색기간의 시작일 ~ 종료일을 선택하세요.");
                return false;
            }            
        }

        if($("#schStDt").val() > $("#schEndDt").val()){
            alert("시작일은 종료일 이전 일자를 선택하세요.");
                return false;
        }

        $("#page").val('1');
        userLog.init();
    })
});