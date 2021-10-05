import resultService from '../services/rest/resultService.mjs';

var resultDtl = {

    init : function(){   

        const userTable = $("#data-list")
        const page =  $("#page").val();
        const pageSize = 20;
        let idx = 1;


        const searchSet = {
            schSteCdIdxNo : $("#schSteCdIdxNo").val(),
            schProcCdIdxNo : $("#schProcCdIdxNo").val(),
            schPcIdxNo : $("#schPcIdxNo").val(),
            schType: $('#schType').val(),
            schStDt: $("#schStDt").val(),
            schEndDt: $("#schEndDt").val(),   
            schDataVal : $("#schDataVal").val()   
        };

        resultService.retrieveId(page, searchSet)
            .then((datas) => {   
                console.log(datas);             
                $("#pageNum").val(datas.pageNum);
                let innerHtml = '';
                if (datas && datas.data) {                
                    innerHtml = datas.data.reduce((inner, data) => {
                        return inner += `
                        <tr>
                            <td>${data.user_id}</td>
                            <td>${data.misn_nm})</td>
                            <td>${data.etc1 === null ? '' : data.etc1}</td>
                            <td>${data.etc2 === null ? '' : data.etc2}</td>
                            <td>${data.etc3 === null ? '' : data.etc3}</td>
                            <td>${data.etc4 === null ? '' : data.etc4}</td>
                            <td>${data.etc5 === null ? '' : data.etc5}</td>
                            <td>${data.etc6 === null ? '' : data.etc6}</td>                            
                        </tr>                  
                        `
                    }, '')

                }
                else {
                    innerHtml = `
                        <tr>
                            <td colspan="8">
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
    resultDtl.init();
    
    $("#page").on('click',function(){
        resultDtl.init();
    })

    $("#excelDown").on('click', function(){    
        
        location.href="/api/result/excelDown?callType=dtl&schSteCdIdxNo="+$("#schSteCdIdxNo").val() +
                "&schProcCdIdxNo="+$("#schProcCdIdxNo").val()+"&schPcIdxNo="+ $("#schPcIdxNo").val() +
                "&schType="+ $('#schType').val() + "&schStDt="+ $("#schStDt").val() +
                "&schEndDt="+ $("#schEndDt").val() + "&schDataVal="+ $("#schDataVal").val() ;
    })

   
});

