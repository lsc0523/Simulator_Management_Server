import dashboardService from '../services/rest/dashboardService.mjs';
import codeService from '../services/rest/codeService.mjs';

var dashboard = {

    init : function(){   
        if($("#typeChk").val() ==null || $("#typeChk").val() ==''){
            window.location.href = 'http://sms.lgensol.com:8081/logout/';
            //alert("권한이 없습니다. 관리자에게 문의하세요.");
            return;

        }
        const userTable = $("#data-list")
        // 시뮬레이션 버전 정보/적용 현황
        dashboardService.retrieveAll()
            .then((datas) => {               
                
                let innerHtml = '';
                if (datas && datas.length > 0) {
                    innerHtml = datas.reduce((inner, curr, idx) => {                                                                      
                        return inner += ' <tr> ' +
                            '<td>'+curr.proc_cd+'</td>'+
                            '<td>'+curr.new_ver+'</td>'+
                            '<td>'+((curr.OC === undefined || curr.OC === null) ? '-' : ((curr.OC.slice(0,(curr.OC.indexOf(' '))) != curr.new_ver) ? '<span class="txt-point">'+curr.OC+'</span>' : curr.OC ) ) +'</td>' +
                            '<td>'+((curr.ESWA === undefined || curr.ESWA === null) ? '-' : ((curr.ESWA.slice(0,(curr.ESWA.indexOf(' '))) != curr.new_ver) ? '<span class="txt-point">'+curr.ESWA+'</span>' : curr.ESWA ) ) +'</td>' +
                            '<td>'+((curr.ESNA === undefined || curr.ESNA === null) ? '-' : ((curr.ESNA.slice(0,(curr.ESNA.indexOf(' '))) != curr.new_ver) ? '<span class="txt-point">'+curr.ESNA+'</span>' : curr.ESNA ) ) +'</td>' +
                            '<td>'+((curr.ESNB === undefined || curr.ESNB === null) ? '-' : ((curr.ESNB.slice(0,(curr.ESNB.indexOf(' '))) != curr.new_ver) ? '<span class="txt-point">'+curr.ESNB+'</span>' : curr.ESNB ) ) +'</td>' +
                            '<td>'+((curr.ESMI === undefined || curr.ESMI === null) ? '-' : ((curr.ESMI.slice(0,(curr.ESMI.indexOf(' '))) != curr.new_ver) ? '<span class="txt-point">'+curr.ESMI+'</span>' : curr.ESMI ) ) +'</td>' +
                            '</tr>';
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
                userTable.html(innerHtml);
                
               
            })
            .catch((err) => {
                console.error(err);
            })
    }
    // 사이트 조회
    , codeRetieve : function(target, groupCodeId){
        
		codeService.retrieve(groupCodeId)
        .then(datas => {           
            let innerSite = '';
            if (datas && datas.length > 0) {
                // 셀렉트 박스에 값 세팅                
                innerSite = datas.reduce((inner, data) => {                   
                    if( data.use_yn !== "0" &&  data.cmn_cd !== "COMMON" ){
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
    // 중계 사이트 버전 정보 / 적용 현황
    , siteVerInfo : function(siteId){
        dashboardService.retrieveSite(siteId)
        .then(datas => {           
            let innerSite = '';
            if (datas && datas.length > 0) {
                // 
                innerSite = datas.reduce((inner, curr, idx) => {                        
                    return inner += `<tr>
                    <td class="bg">
                        <button type="botton" class="call-popup" data-index="${curr.idx_no}" data-proccd="${curr.proc_cd}" id="procDtl_${curr.idx_no}"><span>${curr.proc_cd}</span></button>
                    </td>
                    <td>${curr.ver_nm}</td>
                    <td>${curr.ste_rels_dtm == null ? '' :  moment(curr.ste_rels_dtm).format('YYYY-MM-DD HH:mm:ss')}</td>                                        
                </tr>`;                    
                }, '');
            } else{
                innerSite = `<tr>
                    <td colspan="6">
                        <p class="nodata">조회된 목록이 없습니다.</p>
                    </td>
                </tr>   `;
            }

            $("#siteVerList").html(innerSite);

        })
        .catch((err) => {
            console.error(err);
        })
    }
    // PC 리스트
    , pcList : function(siteId) {
        let pcList = '';
        let verList = '';
        
        let innerSite = '';

        dashboardService.retrievePcList(siteId)
        .then(datas => {
      
            $("#pcCnt").text(datas.length);

            if (datas && datas.length > 0) {                   
                pcList = datas;
            }  
            
        })
        .then(()=> {
            
            for(let i=0; i < pcList.length; i++){
                if(i===0){ innerSite = ''}
                dashboardService.retrievePcVerList(pcList[i].pc_id)
                .then(verDatas => {                      
                    if(verDatas){
                        for(let j=0; j<verDatas.length; j++){
                            if(j===0){verList=''}
                            verList += '<tr>' +
                                        '    <td>' + verDatas[j].proc_cd + '</td>' +
                                        '    <td> ' +
                                        (verDatas[j].ins_pgm_ver === null ? '' : ((verDatas[j].ins_new_ver < verDatas[j].ins_pgm_ver) ? '<span class="txt-point">'+ verDatas[j].ins_pgm_ver + '</span>' : verDatas[j].ins_pgm_ver)) +
                                        '    </td> ' +
                                        '    <td>' + (verDatas[j].rels_dtm === null ? '' : moment(verDatas[j].rels_dtm).format('YYYY-MM-DD HH:mm:ss') ) + '</td>' +
                                        '    <td> ' +
                                        (verDatas[j].dwn_pgm_ver === null ? '' : ((verDatas[j].dwn_new_ver < verDatas[j].dwn_pgm_ver) ? '<span class="txt-point">'+ verDatas[j].dwn_pgm_ver + '</span>' : verDatas[j].dwn_pgm_ver)) +                                       
                                        '    </td> ' +
                                        '    <td> ' + (verDatas[j].dld_dtm === null ? '' : moment(verDatas[j].dld_dtm).format('YYYY-MM-DD HH:mm:ss') ) + '</td>' +
                                        '</tr>';
                        }
                    } else{
                        verList = `<tr>
                                <td colspan="5">
                                <p class="nodata">조회된 목록이 없습니다.</p>
                                </td>
                                </tr>`;
                    }                 
                    
                })
                .then(()=>{                  
                    innerSite += `<li class="acco-item is-active">
                                    <div class="acco-title">
                                        <div class="headnote">
                                            <p class="info-pc">${pcList[i].pc_nm}  /  ${pcList[i].pc_ip}  /  ${pcList[i].loc_desc}</p>
                                        </div>
                                        <button type="button" aria-controls="acco${i}" aria-expanded="true" class="btn acco-toggle"><span><i class="ico">자세히보기</i></span></button>
                                    </div>
                                    <div id="acco${i}" class="acco-cont" style="display:block">
                                        <div class="tbl-area">
                                            <div class="tbl tbl-list">
                                                <div class="tbl-head-fixed">
                                                    <table>
                                                        <colgroup>
                                                            <col style="width:20%" />
                                                            <col style="width:20%" />
                                                            <col style="width:20%" />
                                                            <col style="width:20%" />
                                                            <col style="width:20%" />
                                                        </colgroup>
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">항목</th>
                                                                <th scope="col">현재 설치 버전</th>
                                                                <th scope="col">파일 설치 일자</th>
                                                                <th scope="col">다운로드 버전</th>
                                                                <th scope="col">다운로드 일자</th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </div>
                                                <div class="tbl-body-scroll">
                                                    <table>
                                                        <colgroup>
                                                            <col style="width:20%" />
                                                            <col style="width:20%" />
                                                            <col style="width:20%" />
                                                            <col style="width:20%" />
                                                            <col style="width:20%" />
                                                        </colgroup>
                                                        <tbody>`+verList+`</tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>`;

                                $("#pcInfoList").html(innerSite);
                })
                .catch((err) => {
                    console.error(err);
                })
            }
        })     
        .catch((err) => {
            console.error(err);
        })

    }

    // 시뮬레이터 PC 상세
    /*, simulPcDtl : function(siteId) {
        dashboardService.retrievePc(siteId)
        .then(datas => {
            console.log("simulPcDtl>>>", datas);
            let innerSite = '';
            if (datas && datas.length > 0) {
                
                innerSite = datas.reduce((inner, curr, idx) => {                        
                    return inner += `<option value='${curr.id}'>${curr.name}</option>`;                    
                }, '');
            } 
        })
        .catch((err) => {
            console.error(err);
        })
    } */
    // 공정 PC별 버젼
    , processPcVer : function(siteId, procId, procCd) {
       
        $("#popupProgramPC #viewProcCd").html(procCd);
        $("#popupProgramPC #viewProcCd1").html(procCd);
       
        let new_ver = '';
        
        dashboardService.retrieveProgramNewVer(siteId, procId)
            .then(datas => {               
                if(datas){
                    new_ver = datas.ver_nm;
                    $("#popupProgramPC #viewVersion").html(datas.ver_nm);
                }                
                
                ui.popup.open('popupProgramPC');
            })
            .then(()=>{
                dashboardService.retrieveProgram(siteId, procId)
                    .then(datas => {
                        if(datas){
                            let table_group = '';
                            let thead_tr = '';
                            let tbody_tr = '';
                            
                            for(let i=0; i<datas.length; i++){
                                if(i===(datas.length-1)){
                                    table_group += '<col style="width:15%" />';
                                }else{
                                    table_group += '<col style="width:15%" />';
                                }
                                    
                                thead_tr += '<th scope="col">'+datas[i].pc_nm+'<br>('+datas[i].pc_ip+')</th>';
                                tbody_tr += '<td>'+(datas[i].ver_nm === null ? '-' : ((new_ver > datas[i].ver_nm) ? '<span class="txt-point">'+datas[i].ver_nm+'</span>' : datas[i].ver_nm) ) +'</td>';
                            }

                            $("#table_group").append(table_group);
                            $("#thead_tr").append(thead_tr);
                            $("#tbody_tr").append(tbody_tr);

                        }
                        
                    })            
                    .catch((err) => {
                        console.error(err);
                    })
            })
            .catch((err) => {
                console.error(err);
            })
        
    }
}

$(function(){
    dashboard.codeRetieve('schSite', 'SITE');
    dashboard.init();
    
    function setSiteCd(text) {
        $("#siteCdView").html(text);
        $("#siteCdView1").text(text);
    }

    $("#schSite").on('change', function(){
        setSiteCd($(this).find("option:selected").text());
        
        if($(this).val() === '' ){
            document.getElementById("displayView").style.visibility = "hidden";
        }else{
            document.getElementById("displayView").style.visibility = "visible";
        }
        
        $("#pcInfoList").html('');

        // 사이트(프로그램) 버전 정보    
        dashboard.siteVerInfo($(this).val());
        // PC 리스트
        dashboard.pcList($(this).val());
        
    });

    // 중계 사이트 버전 정보 / 적용 현황 > 공정 클릭시
    $(document).on('click', '[id^="procDtl_"]', function(e){
            dashboard.processPcVer($("#schSite").val(), $(this).data('index'), $(this).data('proccd'));
          
       
    });

    
   
});

