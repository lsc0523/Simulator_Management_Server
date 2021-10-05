import grpCodeService from '../services/rest/groupCodeService.mjs';

var grpCode = {

    init : function(){   

        const userTable = $("#data-list")
        var page =  $("#page").val();
        var pageSize = 20;
        var idx = 1;
        grpCodeService.retrieve(page)
            .then((datas) => {                                
                $("#pageNum").val(datas.pageNum);
                let innerHtml = '';
                if (datas && datas.data) {
                    innerHtml = datas.data.reduce((inner, groupcode) => {
                        return inner += `
                        <tr >
                            <td>${((page-1)*pageSize)+idx++}</td>
                            <td>${groupcode.gr_cd}</td>
                            <td>${groupcode.gr_cd_nm}</td>
                            <td>${groupcode.use_yn ? "사용중" : "사용안함"}</td>                           
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
    grpCode.init();
   
    $("#page").on('click',function(){
        grpCode.init();
    })
   
})
;

