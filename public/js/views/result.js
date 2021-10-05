import resultService from '../services/rest/resultService.mjs';
import codeService from '../services/rest/codeService.mjs';

let searchSet = '';

var result = {

    init : function(){   

        const userTable = $("#data-list")
        const page =  $("#page").val();
        const pageSize = 20;
        let idx = 1;

        searchSet = {
            schSteCdIdxNo : $("#schSite").val(),
            schProcCdIdxNo : $("#schProc").val(),
            schPcIdxNo : $("#schPc").val(),
            schType: $('input:radio[name=schType]:checked').val(),            
            schStDt: $("#schStDt").val().replaceAll('-',''),
            schEndDt: $("#schEndDt").val().replaceAll('-','')         
        };

        if(searchSet && searchSet.schType){
            let schTypeText= '';
            if(searchSet.schType === "Users"){
                schTypeText = "E-mail (ID)";
            }else{
                schTypeText ="Mission";
            }
            $("#schTypeText").html(schTypeText);
        }

        resultService.retrieveAll(page, searchSet)
            .then((datas) => {    
                console.log(datas);
                $("#pageNum").val(datas.pageNum);
                let innerHtml = '';
                if (datas && datas.data) {                
                    innerHtml = datas.data.reduce((inner, data) => {
                        
                        return inner += `
                        <tr>
                            <td>${data.ste_cd}</td>
                            <td>${data.pc_nm === null ? '' : data.pc_nm}</td>                            
                            <td>${data.proc_cd}</td>
                            <td><span>${data.sch_type_data}</span></td>
                            <td>${data.cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</td>                            
                            <td><button type="button" class="btn btn-reg" onclick="dtlSet('${data.ste_cd}', '${data.pc_nm}', '${data.proc_cd}', ${data.ste_cd_idx_no}, ${data.proc_cd_idx_no}, ${data.pc_idx_no}, '${data.sch_type_data}');"><span>상세보기</span></button></td>
                            
                        </tr>                        
                        `
                    }, '')

                }
                else {
                    innerHtml = `
                        <tr>
                            <td colspan="6">
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
    , codeRetieve : function(target, groupCodeId){
        
		codeService.retrieve(groupCodeId)
        .then(datas => {           
            let innerSite = '';
            if (datas && datas.length > 0) {
                // 셀렉트 박스에 값 세팅                
                innerSite = datas.reduce((inner, data) => {                        
                    if( data.use_yn === "1" &&  data.cmn_cd !== "COMMON" ){
                        inner += `<option value='${data.idx_no}'>${data.cmn_cd}</option>`;    
                    }
                    return inner;                                        
                }, '');
            } 

            $("#"+target).append(innerSite);
           
        })
        .catch((err) => {
            console.error(err);
        })
    } 
    , siteInPcList : function(siteCd){
        
        resultService.retrivePcList(siteCd)
        .then(datas => { 
            let innerSite = '';   
            if(datas){
                innerSite = datas.reduce((inner, data) => {                                            
                    return inner += `<option value='${data.idx_no}'>${data.pc_nm}</option>`;    
                }, '');
            }

            $("#schPc").append(innerSite);
        })
        .catch((err) => {
            console.error(err);
        })
    }
}

$(function(){
    result.codeRetieve('schSite', 'SITE');
    result.codeRetieve('schProc', 'PROCESS');


    $("#page").on('click',function(){
        result.init();
    })

    $("#excelDown").on('click', function(){   

        if(searchSet === ''){
            alert("데이터 조회 후 Excel 다운로드가 가능합니다.");
            return false;
        }else{
            let queryString = "";
            if (searchSet) {
                for (const key in searchSet) {
                    if (searchSet[key]) {
                        queryString += `&${key}=${searchSet[key]}`
                    }
                }
            }  

            
            location.href="/api/result/excelDown?callType=lst&"+queryString;
        }
    })

    $("#excelDownDtl").on('click', function(){
        location.href="/api/result/excelDown?callType=lst&name=";
    })

    $("#btnSearch").on('click', function(){
        let stdCnt = 0;
        if($("#schSite").val() !== '') {
            stdCnt++; 
        }

        if($("#schPc").val() !== '' ){
            stdCnt++;
        } 
        
        if($("#schProc").val() !== ''){
            stdCnt++;
        }

        if(stdCnt === 0 ) {
            alert("SITE, PC, 공정 중 하나의 검색조건을 선택하세요.");
            return false;
        }

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
        result.init();
    });

   $("#schSite").on('change', function(){
        $("#schPc").html("<option value=\"\">전체</option>");
       result.siteInPcList($(this).val());
   })
})
;

