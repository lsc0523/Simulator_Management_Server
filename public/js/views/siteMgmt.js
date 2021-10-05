import siteService from '../services/rest/siteService.mjs';


var site = {

    init : function(){   

        const userTable = $("#data-list")
        
        siteService.retrieveAll()
            .then((datas) => {
                
                $("#pageNum").val(datas.pageNum);
                let innerHtml = '';
                if (datas) {
                    innerHtml = datas.reduce((inner, data) => {
                        return inner += `
                        <tr class="row-link" onclick='site_view_pop(${data.idx_no}, "${data.site.cmn_cd}", "${data.rels_tm}");'>
                            <td>
                                ${data.site.cmn_cd}
                            </td>
                            <td>${data.rels_tm}</td>
                            <td>${data.local_tm}</td>
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
               
            })
            .catch((err) => {
                console.error(err)
            })
    }
    
}

$(function(){
    site.init();

    $("#siteIfoSaveBtn").on('click',function(){
        let relsTm = $("#popupSiteIfo #popRelsTm1").val() + ":" +
                     $("#popupSiteIfo #popRelsTm2").val() + ":" +
                     $("#popupSiteIfo #popRelsTm3").val();

        if(!relsTm){
            $(".type-alert .popup-content").text("배포 예약 시간을 확인 해 주세요.");
            ui.popup.open('popupAlert');
            return false;
        }
        var params = {
            rels_tm: relsTm,
            upus_id: ''
        };
        $("#siteIfoSaveBtn").prop("disabled", true);
        siteService.update($("#popupSiteIfo #popIdxNo").val(), params)
        .then((data) => {
            $("#siteIfoSaveBtn").prop("disabled", false);
            $(".type-alert .popup-content").text("수정 되었습니다.");
            ui.popup.open('popupAlert');
            ui.popup.close('popupSiteIfo');
            site.init();
        })
        .catch((err) => {
            console.error(err)
            $("#siteIfoSaveBtn").prop("disabled", false);
            $(".type-alert .popup-content").text("failed to update");
            ui.popup.open('popupAlert');
        });
           
        
    })
   
})
;

