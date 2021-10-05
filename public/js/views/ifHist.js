import ifService from '../services/rest/ifService.mjs';


var ifHist = {

    init : function(){   

        const userTable = $("#data-list")
        var page =  $("#page").val();
        var pageSize = 20;
        var idx = 1;
        var searchSet = {
            schStDt: $("#schStDt").val().replaceAll('-', ''),
            schEndDt: $("#schEndDt").val().replaceAll('-', '')
        }
        ifService.retrieveAll(page, searchSet)
            .then((datas) => {
                
                $("#pageNum").val(datas.pageNum);
                let innerHtml = '';
                if (datas && datas.data.length > 0) {
                    innerHtml = datas.data.reduce((inner, data) => {
                        return inner += `
                        <tr>
                            <td>${moment(data.reg_dtm).format('YYYY-MM-DD HH:mm:ss')}</td>
                            <td>${data.if_nm}</td>
                            <td>${data.log_ctn}</td>
                            <td>${data.rtn_data}</td>
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

}

$(function(){
    ifHist.init();
    
    $("#page").on('click',function(){
        ifHist.init();
    });

    $("#btnSearch").on('click', function(){
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
        ifHist.init();
    });   
   
})
;

