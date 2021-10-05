import simulatorService from '../services/rest/simulatorService.mjs';
import codeService from '../services/rest/codeService.mjs';
import siteService from '../services/rest/siteService.mjs';

var simulator = {

    init : function(){   

        const userTable = $("#data-list")
        var page =  $("#page").val();
        var pageSize = 20;
        var idx = 1;
        var searchSet = {
            schSteCdIdxNo : $("#schSite").val(),
            schProcCdIdxNo : $("#schProc").val(),
            schStDt: $("#schStDt").val().replaceAll('-',''),
            schEndDt: $("#schEndDt").val().replaceAll('-','')         
        };

        simulatorService.retrieveAll(page, searchSet)
            .then((datas) => {

                $("#pageNum").val(datas.pageNum);
                let innerHtml = '';
                if (datas && datas.data) {
                    innerHtml = datas.data.reduce((inner, rowdata) => {
                        return inner += `
                        <tr>
                            <td>${((page-1)*pageSize)+idx++}</td>
                            <td>${rowdata.ste_cd}</td>
                            <td>${rowdata.proc_cd}</td>
                            <td>${rowdata.ver_nm}</td>
                            <td>${rowdata.reg_dtm == null ? '' : moment(rowdata.reg_dtm).format('YYYY-MM-DD HH:mm:ss')}</td>
                            <td>${rowdata.rels_way == "1" ? "즉시":"예약"}</td>
                            <td><a href="/upload${rowdata.upld_file_path}${rowdata.upld_file_nm}" download="${rowdata.upld_file_nm}" class="link">${rowdata.upld_file_nm}</a></td>
                            <td><a href="/upload${rowdata.pgsc_file_path}${rowdata.pgsc_file_nm}" download="${rowdata.pgsc_file_nm}" class="link">${rowdata.pgsc_file_nm}</a></td>
                            <td>${rowdata.rgst_nm == null ? '' : rowdata.rgst_nm}</td>
                            <td>
                                <span class="ellipsis w-sm">${rowdata.memo_ctn == null ? '': rowdata.memo_ctn}</span>
                            </td>
                        </tr>
                        `
                    }, '')

                }
                else {
                    innerHtml = `
                        <tr>
                            <td colspan="10">
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
    },
    deploySiteList : function(){
        const userTable = $("#deploySiteList")
        
        siteService.retrieveAll()
        .then((datas) => {           
          
            let innerHtml = '';
            if (datas) {
                innerHtml = datas.reduce((inner, data) => {
                   
                    return inner += `
                    <li>
                        <span class="check style1">
                            <input type="checkbox" name="popDeploySite" id="pop_${data.site.cmn_cd}" value="${data.site.idx_no}">
                            <label for="pop_${data.site.cmn_cd}">
                                <span>${data.site.cmn_cd}</span>
                            </label>
                        </span>
                        <span class="check-desc">
                            <span class="txt">한국시간 : ${data.rels_tm}</span>
                            <span class="txt">현지시간 : ${data.local_tm}</span>
                        </span>
                    </li>
                    `
                }, '')

            }
           
            userTable.html(innerHtml)
           
        })
        .catch((err) => {
            console.error(err)
        })
    }   

}

$(function(){
    simulator.codeRetieve('schSite', 'SITE');
    simulator.codeRetieve('schProc', 'PROCESS');
    
    simulator.init();

    $("#btnReg").on('click', function(){
        simulator.codeRetieve('popProcId', 'PROCESS');
        simulator.deploySiteList();
        ui.popup.open('popupProgramReg');
    });

    // 파일 등록  공정코드, 사이트코드
    function uploadFile(procCd, deploySiteCd) {
        // 등록할 파일 리스트
        return new Promise((resolve, reject) => {
    
            const uploadFileList = [...fileList];   
           
            // 파일이 있는지 체크
            if (uploadFileList.length > 0 ) {

                let statusCnt = 0;
              
                uploadFileList.map((file, idx) => {
                    
                    if(file){
                        var formData = new FormData();
                        formData.append('file', file);
                        $('div.loading-bar.'+idx).show();
                        var xhr = new XMLHttpRequest(); 
                        xhr.open('post', '/api/simulator/file/'+procCd+'/'+deploySiteCd, true);
                        xhr.upload.onprogress = function(e) {
                        if (e.lengthComputable) {
                            var viewPercentage = '';
                            var percentage = (e.loaded / e.total) * 100;
                            $('div.loading-bar.'+idx+' div').css('width', percentage.toFixed(0) + '%');
                            if(percentage.toFixed(0) > 5){
                                viewPercentage = percentage.toFixed(0) + '%';
                            }else{
                                viewPercentage = percentage.toFixed(0) ;
                            }
                            $('div.loading-bar.'+idx+' div').html(viewPercentage);
                        }
                        };
                        xhr.onerror = function(e) {
                            alert('An error occurred while submitting the form. Maybe your file is too big');
                            return reject();
                        };
                        xhr.onload = function(e) {
                            var file = xhr.responseText;
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {                                 
                                    statusCnt += 1;
                                    $('div.loading-bar.'+ idx + 'div').css('width','0%');                                    
                                }
                            }
                            
                            if(statusCnt == 2){
                                resolve();
                            }
                        };                            
                        xhr.send(formData);                             
                    }    
                    
                })
            }else{
                console.log("no file");
                resolve();
            }
        })    
            
    };

    $("#closePopBtn").on('click', function(){
        pop_reset();
        ui.popup.close('popupProgramReg')
    });

    $("#closePopBtnX").on('click', function(){
        pop_reset();
        ui.popup.close('popupProgramReg')
    });

    $("#saveBtn").on('click',function(){
        
        //유효성 체크
        let $b = $("#popupProgramReg input");
        let $t, t;
        let result = true;
        let rels_way = false;

        const procCd = $("#popProcId option:selected").text();

        // 배포 사이트 array
        const deploySiteArr = [];
        const deploySiteCd = [];
        const insIdxNo = [];

        $("input:checkbox[name=popDeploySite]:checked").each(function(){
            deploySiteArr.push($(this).val());
            deploySiteCd.push($(this).next().children("span").text());
        });

        if($("input:checkbox[name=popDeploySite]:checked").length == 0) {
            $(".type-alert .popup-content").text("배포 사이트를 선택하세요.");
            ui.popup.open('popupAlert');
            result = false;
            return false;
        };
       
        
        if(!$("#popUpdld").val()){
            $(".type-alert .popup-content").text("설치 파일을 등록하세요.");
            ui.popup.open('popupAlert');
            result = false;
            return false;
        }

        if(!$("#popPgSc").val()){
            $(".type-alert .popup-content").text("소스 파일을 등록하세요.");
            ui.popup.open('popupAlert');
            result = false;
            return false;
        }

        if($("#popUpdld")[0].files[0].name === $("#popPgSc")[0].files[0].name){
            $(".type-alert .popup-content").text("[설치/소스 파일] 동일한 파일 등록할 수 없습니다.");
            ui.popup.open('popupAlert');
            result = false;
            return false;
        }

        if($("input:checkbox[id=popRelsWay]").is(":checked")) {
            rels_way = true;
        };
        
        if(result){            
            for(let i=0;i< deploySiteArr.length; i++){
                var params = {
                    proc_cd_idx_no: $("#popProcId").val(),
                    ste_cd_idx_no: deploySiteArr[i],
                    rels_way: rels_way === true ? '1' : '0' ,
                    upld_file_nm: $("#popUpdld")[0].files[0].name,                    
                    upld_file_path: "/PROGRAM/"+deploySiteCd[i]+"/"+procCd+"/",
                    upld_file_capa: $("#popUpdld")[0].files[0].size,
                    ver_nm: $("#dispVer").html(),
                    pgsc_file_nm: $("#popPgSc")[0].files[0].name,                    
                    pgsc_file_path: "/PROGRAM/"+deploySiteCd[i]+"/"+procCd+"/",
                    pgsc_file_capa: $("#popPgSc")[0].files[0].size,
                    rgst_nm: $("#popRgstNm").val(),
                    memo_ctn: $("#popMemoCtn").val()
                };
            
                if(i==0){
                    $("#saveBtn").prop('disabled', true);     
                    $("#closePopBtn").prop('disabled', true);
                    $("#closePopBtnX").prop('disabled', true);
                }

                simulatorService.create(params)
                .then((data) => {
                    if(deploySiteArr[i] === data.ste_cd_idx_no){
                        insIdxNo.push(data.idx_no);   
                    }
                        
                    return uploadFile(procCd, deploySiteCd[i]);
                   
                })
                .then(() => {
                   
                    if(i== (deploySiteArr.length-1)){
                        if(rels_way){                          
                            params.siteCd = deploySiteCd;
                            params.procCd = procCd;
                            params.insIdxNo = insIdxNo;
    
                            simulatorService.fileFtpSend(params);
                        }

                        $("#saveBtn").prop('disabled', false);
                        $("#closePopBtn").prop('disabled', false);
                        $("#closePopBtnX").prop('disabled', false);
                        
                        $(".type-alert .popup-content").text("등록 되었습니다.");
                        ui.popup.open('popupAlert');
                        pop_reset();
                        ui.popup.close('popupProgramReg');
                        simulator.init();
                    } 
                }) 
                .catch((err) => {
                    console.error(err)                    
                   
                    $("#saveBtn").prop('disabled', false);
                    $("#closePopBtn").prop('disabled', false);
                    $("#closePopBtnX").prop('disabled', false);
                    $(".type-alert .popup-content").text("등록 실패하였습니다.");
                    ui.popup.open('popupAlert');
                })
            }
        }
    });
    
    $("#page").on('click',function(){
        simulator.init();
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
        simulator.init();

    });

    // 업로드 파일 목록 생성
    function addFileList(btnType, fileName, fileSizeStr) {

        var html = `
            <ul>
                <li>
                    <div class="file-name">
                        <span class="name">${fileName}</span>
                    </div>
                    <div class="file-info">
                        <span class="byte">${fileSizeStr}</span>
                        <button type="button" class="btn btn-remove"  data-index="${btnType}" id="fileDelete_${btnType}"><span>삭제</span></button>
                    </div>
                </li>
            </ul>
            `;

        $('#'+btnType+'FileSize').text(fileSizeStr);
        $('#'+btnType+'FileArea').html(html);       
    }
   
    // 등록할 전체 파일 사이즈
    var totalFileSize = 0;
    // 파일 리스트
    var fileList = new Array();
    // 파일 사이즈 리스트
    var fileSizeList = new Array();
    // 등록 가능한 파일 사이즈 MB
    var uploadSize = 700;
    // 등록 가능한 총 파일 사이즈 MB
    var maxUploadSize = 1000;
    //수정 시 실제 삭제해야 할 파일리스트
    var deleteList = new Array();

    function settingFile(btnType, files, fileIndex){
   
        let timestamp = (new Date).valueOf();
        
        let fileName = files[0].name;
        const fileNameArr = fileName.split("\.");
        // 확장자
        const ext = fileNameArr[fileNameArr.length - 1];
        
        if(btnType === "updld"){
            const verArr = fileName.split("_");
            if(verArr.length > 0){
                $("#dispVer").html(verArr[0]);
            }
        }

        const fileSize = files[0].size; // 파일 사이즈(단위 :byte)
        if (fileSize <= 0) {
            return;
        }

        const fileSizeKb = fileSize / 1024; // 파일 사이즈(단위 :kb)
        const fileSizeMb = fileSizeKb / 1024;    // 파일 사이즈(단위 :Mb)
        const fileSizeGb = fileSizeMb / 1024;    // 파일 사이즈(단위 :Gb)

        let fileSizeStr = "";
        if ((1024 * 1024 * 1024) <= fileSize) {    // 파일 용량이 1기가 이상인 경우 
            fileSizeStr = fileSizeGb.toFixed(2) + " GB";
        } else if ((1024 * 1024) <= fileSize) {    // 파일 용량이 1메가 이상인 경우 
            fileSizeStr = fileSizeMb.toFixed(2) + " MB";
        } else if ((1024) <= fileSize) {
            fileSizeStr = parseInt(fileSizeKb) + " KB";
        } else {
            fileSizeStr = parseInt(fileSize) + " byte";
        }
       
        // 파일 배열에 넣기
        fileList[fileIndex] = files[0];

        // 파일 사이즈 배열에 넣기
        fileSizeList[fileIndex] = fileSizeMb;

        // 업로드 파일 목록 생성
        addFileList(btnType ,fileName, fileSizeStr);
     
    }

    // 설치파일 upload
    $("#popUpdld").change(function (e){
        const files = e.target.files;
        
        if(files.length > 0){         
            settingFile("updld", files, 0);         
        }
    });

    // 소스파일 upload
    $("#popPgSc").change(function (e){
        const files = e.target.files;

        if(files.length > 0){         
            settingFile("source", files, 1);             
        }
    });
    
    $(document).on('click', '[id^="fileDelete_"]', function(e){

        let idx = 0;

        if( $(this).data('index') === "source"){
            idx = 1;
        }
        
        fileList[idx] = '';

        $("#"+$(this).data('index')+"Btn").val();
        $("#"+$(this).data('index')+"FileArea").html('');
        $("#"+$(this).data('index')+"FileSize").text('0');
        
        if( $(this).data('index') === "updld"){
            $("#dispVer").html('');
            $("#popUpdld").val('');
        }else{
            $("#popPgSc").val('');
        }
        
    });

    function pop_reset(){
        
        $("#popProcId").html('');
        $("#deploySiteList").html('');
        $("#popRelsWay").prop("checked", false);
        $("#popUpdld").val('');
        $("#updldFileSize").text();
        $("#updldFileArea").html('');
        $("#dispVer").html('');
        $("#popPgSc").val('');
        $("#sourceFileSize").text();
        $("#sourceFileArea").html('');
        $("#popMemoCtn").val('');
        $('div.loading-bar.0 div').css('width','0%');
        $('div.loading-bar.0').hide();  
        $('div.loading-bar.1 div').css('width','0%');
        $('div.loading-bar.1').hide();  
    }

});

