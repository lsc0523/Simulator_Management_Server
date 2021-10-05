import codeService from '../services/rest/codeService.mjs';
import videoService from '../services/rest/videocallService.mjs';
import fileService from '../services/rest/fileService.mjs';

var hist = {

    init: function () {
    if($("#hist_search").val() == '0'){
        $("#sFormType").val('');
        $("#sFormStatus").val('')
        $("#sFormRegion").val('')
    }
        const dataTable = $("#hist-tbody")
        var page = $("#page").val();
        var options = {
            startDate: $("#sFormDate_hist").val().replaceAll('-', ''),
            endDate: $("#sUntilDate_hist").val().replaceAll('-', ''),
            region: $("#sFormRegion").val(),
            type: $("#sFormType").val(),
            result: $("#sFormStatus").val(),
            title: $("#sFormText").val(),
            manager: $("#sFormManager").val(),
        }
        videoService.retrieveAll(page, options)
            .then((datas) => {
                $("#pageNum").val(datas.pageNum);
                let innerHtml = '';
                if (datas && datas.data.length > 0) {
                    $.each(datas.data, function (idx, data) {
                        innerHtml += `
                        <tr>
                            <td>${data.id}</td>
                            <td>${data.manager}</td>
                            <td>${moment(data.start_date).format('YYYY-MM-DD HH:mm:ss')}</td>
                            <td>${moment(data.end_date).format('YYYY-MM-DD HH:mm:ss')}</td>
                            <td>${data.calling_time}</td>
                            <td><button type="button" class="btn btn-log" onclick="go_log('${data.id}');"><span>확인</span></button></td>
                            <td>${data.result_region}</td>
                            <td>${data.result_title}</td>
                            <td>${data.result_type}</td>
                            <td>${data.result_result}</td>
                            <td>${data.result_message.length > 0 ? `<button type="button" class="btn btn-log" onclick="go_message('${data.id}')"><span>확인</span></button>` : ""}</td>
                            <td><button type="button" class="btn btn-reg" onclick="javascript:go_meeting('${data.id}','${data.result_title}','${data.result_type}','${data.result_result}','${data.result_region}','${data.files.length}');"><span>${data.result_title == "" ? "등록" : "확인/수정"}</span></button></td>
                            <td>${data.files.length > 0 ? `<button type="button" class="btn btn-reg" onclick="go_set('fileList', '${data.id}');"><span>다운로드</span></button>` : `-`}</td>
                            <input type="hidden" id="${data.id}_org_text" value="${data.result_text}">
                        </tr>
                    `

                    })
                } else {
                    innerHtml = `
                    <tr>
                        <td colspan="11">
                            <p class="nodata">조회된 목록이 없습니다.</p>
                        </td>
                    </tr>
                `
                }
                dataTable.html(innerHtml);
                //paging 
                pagenation(page, datas.pageNum);
            })
            .catch((err) => {
                console.error(err)
            })

        codeService.retrieve()
            .then((data) => {

                var str = "";
                if (data && data.length > 0) {
                    $.each(data, function (idx, code) {
                        if (code.is_enabled == true && code.groupcode.groupcode == 'VC_TYPE') {
                            str += "<option value='" + code.id;
                            str += "'>" + code.name + "</option>";
                        }
                    })
                    $("#sLabelPop4").html("");
                    $("#sLabelPop4").html(str);

                    if (($("#hist_search").val() != '1') && ($("#sFormType").val() == 0)) {
                        $("#sFormType").html('<option value="">전체</option>' + str);
                    }

                    str = "";
                    $.each(data, function (idx, code) {
                        if (code.is_enabled == true && code.groupcode.groupcode == 'VC_RESULT') {
                            str += "<option value=" + code.id;
                            str += ">" + code.name + "</option>";
                        }

                    })
                    $("#sLabelPop5").html("");
                    $("#sLabelPop5").html(str);

                    if ($("#hist_search").val() != '1' && $("#sFormStatus").val() == 0) {
                        $("#sFormStatus").html('<option value="">전체</option>' + str);
                    }

                    str = "";
                    $.each(data, function (idx, code) {
                        if (code.is_enabled == true && code.groupcode.groupcode == 'REGION') {
                            str += "<option value=" + code.id;
                            str += ">" + code.name + "</option>";
                        }

                    })
                    $("#sPopRegion").html("");
                    $("#sPopRegion").html(str);

                    if ($("#hist_search").val() != '1' && $("#sFormRegion").val() == 0) {
                        $("#sFormRegion").html('<option value="">전체</option>' + str);
                    }

                }

            })
            .catch((err) => {
                console.error(err)
            })

    }
}

$(function () {
    hist.init();

    $("#saveBtn").on('click', function () {
        //유효성 체크
        var $b = $("#popupMeeting");
        var $t, t;
        var result = true;

        $b.find("input").each(function (i) {
            $t = jQuery(this);
            if ($t.prop("required")) {
                if (!jQuery.trim($t.val())) {
                    t = jQuery("label[for='" + $t.attr("id") + "']").text();
                    result = false;
                    $t.focus();
                    $(".type-alert .popup-content").text(t + "은(는) 필수 입력입니다.");
                    ui.popup.open('popupAlert');
                    return;
                }
            }
        });
        if ($("#text_area").val().trim() == '') {
            result = false;
            $("#text_area").val('');
            $("#text_area").focus();
            $(".type-alert .popup-content").text("내용은 필수 입력입니다.");
            ui.popup.open('popupAlert');
            return;
        }
        if ($(".file-name").length>10) {
            result = false;
            
            $(".type-alert .popup-content").text("동시에 첨부할 수 있는 파일수는 최대 10개 입니다.");
            ui.popup.open('popupAlert');
            return;
        }
        // 최대용량 넘을 경우 업로드 불가
        if (totalFileSize>maxUploadSize) {
           
            result = false;
            
            $(".type-alert .popup-content").text("최대 파일용량을 초과 하였습니다.\n한번에 업로드 할 수 있는 파일용량은 최대 " + maxUploadSize + "MB 입니다.");
            
            ui.popup.open('popupAlert');
            
            return;
        }
        if (result) {
            $("#saveBtn").attr('disabled', true);
            $(".closeBtn").attr('disabled', true);
            $(".btn-remove").attr('disabled', true);
            var params = {
                type_id: $("#sLabelPop4").val(),
                result_id: $("#sLabelPop5").val(),
                region_id: $("#sPopRegion").val(),
                title: $("#sLabelPop1").val(),
                text: $("#text_area").val().replace(/(?:\r\n|\r|\n)/g, '<br>')
            };
            if ($("#org_title").val() == '') {

                videoService.createResult($("#his_id").val(), params)
                    .then((data) => {
                        return uploadFile()
                       
                    })
                    .then(() => {
                        	
                        $(".type-alert .popup-content").text("등록 되었습니다.");

                        $("#saveBtn").attr('disabled', false);
                        $(".closeBtn").attr('disabled', false);
                        $(".btn-remove").attr('disabled', false);

                        ui.popup.open('popupAlert');
                        m_reset();
                        ui.popup.close('popupMeeting');
                        hist.init();
                        
                    })
                    .catch((err) => {
                        console.error(err)
                        $(".type-alert .popup-content").text("등록 실패하였습니다.");
                        $("#saveBtn").attr('disabled', false);
                        $(".closeBtn").attr('disabled', false);
                        $(".btn-remove").attr('disabled', false);
                        ui.popup.open('popupAlert');
                        m_reset();
                        ui.popup.close('popupMeeting');
                        hist.init();
                    })
            }
            else {
                videoService.updateResult($("#his_id").val(), params)
                    .then((data) => {
                        return uploadFile()
                    })
                    .then(() => {
                        $(".type-alert .popup-content").text("수정 되었습니다.");
                        $("#saveBtn").attr('disabled', false);
                        $(".closeBtn").attr('disabled', false);
                        ui.popup.open('popupAlert');
                        m_reset();
                        ui.popup.close('popupMeeting');
                        hist.init();
                        
                    })
                    .catch((err) => {
                        console.error(err)
                        $(".type-alert .popup-content").text("수정 실패하였습니다.");
                        $("#saveBtn").attr('disabled', false);
                        $(".closeBtn").attr('disabled', false);
                        ui.popup.open('popupAlert');
                        m_reset();
                        ui.popup.close('popupMeeting');
                        hist.init();
                    })
            }
        }

    })
    $("#op_log").on('click', function () {
        videoService.retrieveOperatorAtVideocall($("#his_id").val())
            .then((datas) => {

                var str = "";

                if (datas && datas.length > 0) {
                    let innerHtml = "";
                    //회의록 등록/수정 팝업에 참여자 정보 노출
                    if ($("#op_log").val() == 'meet') {
                        var a = [];
                        for (var i = 0; i < datas.length; i++) {
                            a[i] = datas[i].operator_name;
                        }
                        //filter로 중복제거
                        var unique = a.filter(function (itm, i, a) {
                            return i == a.indexOf(itm);

                        });
                        for (var j = 0; j < unique.length; j++) {
                            innerHtml += unique[j] + '   '
                        }
                        $("#sLabelPop2").val(innerHtml);

                    } else {
                        $.each(datas, function (idx, data) {
                            innerHtml += `
                            <tr>
                                <td>${moment(data.start_date).format('YYYY-MM-DD HH:mm:ss')}</td>
                                <td>${moment(data.end_date).format('YYYY-MM-DD HH:mm:ss')}</td>
                                <td>${data.region}</td>
                                <td>${data.operator_name}</td>
                            </tr>
                        `
                            $("#opLogTable").html("");
                            $("#opLogTable").html(innerHtml);
                        })

                    }

                }

            })
            .catch((err) => {
                console.error(err)
            })
    })

    $("#go_page").on('click', function () {
        hist.init();
    })
    $("#hist_search").on('click', function () {
        $("#hist_search").val("1");
        $("#page").val('1');
        hist.init();
    })

    $("#message_log").on('click', function () {
        videoService.retreiveMessage($("#his_id").val())
            .then((datas) => {
                if (datas && datas.length > 0) {
                    let innerHtml = "";
                    $.each(datas, function (idx, data) {
                        innerHtml += `
                            <div class="chat-item ${data.user_type == 'ADM' || data.user_type == 'MNG' ? 'oneself' : 'opponent'}">
                                <p class="txt-worker">${data.user_name}</p>
                                `
                        if (data.type == "T") {
                            innerHtml += `
                                <div class="chat-msg">
                                    <div class="txt-box">
                                        <p class="txt-sender"><span class="msg">${data.message}</span></p>
                                        `;
                            if (data.receive_message && data.receive_message.length > 0) {
                                $.each(data.receive_message, function (idx, receive_message) {
                                    if (data.user_type == "ADM" || data.user_type == "MNG") {
                                        innerHtml += `<p class="txt-receiver"><span class="msg">[${receive_message.to_user.name}] ${receive_message.message}</span></p>`
                                    } else {
                                        innerHtml += `<p class="txt-receiver"><span class="msg">${receive_message.message} [${receive_message.to_user.name}]</span></p>`
                                    }
                                })
                            }
                            innerHtml += `  
                                        </div>
                                        <p class="time">${moment(data.created_at).format('YYYY-MM-DD HH:mm:ss')}</p>
                                    </div>
                                    `
                        } else if (data.type == "I") {
                            innerHtml += `
                                <div class="chat-msg">
                                    <div class="img-box">
                                        <a href="${data.message}" target="_blank"><img src="${data.message}" alt=""></a>
                                    </div>
                                    <p class="time">${moment(data.created_at).format('YYYY-MM-DD HH:mm:ss')}</p>
                                </div>
                            `
                        }

                        innerHtml += `
                            </div>
                            `

                        $("#div_chat_item").html("");
                        $("#div_chat_item").html(innerHtml);
                    })
                }

            })
            .catch((err) => {
                console.error(err);
            })
    })

    // 파일 리스트 번호
    var fileIndex = 0;
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
    //view 화면 기존 파일 사이트 리스트
    var newSizeList = new Array();

    $("#file_btn").change(function (e) {
        var files = e.target.files;
        for (var i = 0; i < files.length; i++) {
            if (files.length < 11) {

                if($(".orgArea .style1").text().indexOf(files[i].name) == -1 &&  $(".newArea .style1").text().indexOf(files[i].name) == -1){
                    // 파일 이름
                    var fileName = files[i].name;
                    var fileNameArr = fileName.split("\.");
                    // 확장자
                    var ext = fileNameArr[fileNameArr.length - 1];

                    var fileSize = files[i].size; // 파일 사이즈(단위 :byte)
                    if (fileSize <= 0) {
                        return;
                    }

                    var fileSizeKb = fileSize / 1024; // 파일 사이즈(단위 :kb)
                    var fileSizeMb = fileSizeKb / 1024;    // 파일 사이즈(단위 :Mb)

                    var fileSizeStr = "";
                    if ((1024 * 1024) <= fileSize) {    // 파일 용량이 1메가 이상인 경우 
                        fileSizeStr = fileSizeMb.toFixed(2) + " MB";
                    } else if ((1024) <= fileSize) {
                        fileSizeStr = parseInt(fileSizeKb) + " KB";
                    } else {
                        fileSizeStr = parseInt(fileSize) + " byte";
                    }

                    /* if ($.inArray(ext, [ 'exe', 'bat', 'sh', 'java', 'jsp', 'html', 'js', 'css', 'xml' ]) >= 0) {
                        // 확장자 체크
                        alert("등록 불가 확장자");
                        break; */
                    //if ($.inArray(ext, [ 'hwp', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'png', 'pdf', 'jpg', 'jpeg', 'gif', 'zip' ]) <= 0) {
                    // 확장자 체크
                    /* alert("등록이 불가능한 파일 입니다.");
                    break; */
                    //  alert("등록이 불가능한 파일 입니다.("+fileName+")");
                    //} else */
                    if (fileSizeMb > uploadSize) {
                        // 파일 사이즈 체크
                        alert("용량 초과\n업로드 가능 용량 : " + uploadSize + " MB");
                        break;
                    } else {
                        // 전체 파일 사이즈
                        totalFileSize += fileSizeMb;

                        // 파일 배열에 넣기
                        fileList[fileIndex] = files[i];

                        // 파일 사이즈 배열에 넣기
                        fileSizeList[fileIndex] = fileSizeMb;

                        // 업로드 파일 목록 생성
                        addFileList(fileIndex, fileName, fileSizeStr);

                        // 파일 번호 증가
                        fileIndex++;
                    }
                }
                
            } else {
                $(".type-alert .popup-content").text("최대 첨부 파일수를 초과 하였습니다.\n동시에 첨부할 수 있는 파일수는 최대 10개 입니다.");
                ui.popup.open('popupAlert');
            }
        }

    })
    // 업로드 파일 목록 생성
    function addFileList(fIndex, fileName, fileSizeStr) {

        var html = `
                <li id="fileTr_${fIndex}">
                    <div class="file-name newArea">
                        <span class="check style1">
                            <input type="checkbox" name="sFileCheck" >
                            <label for="sFileCheck5"><span>${fileName}</span></label>
                        </span>
                    </div>
                    <div class="file-info">
                        <em class="byte">${fileSizeStr}</em>
                        <button type="button" class="btn btn-remove" onclick="go_delete('${fIndex}')" return false;'><span>파일삭제</span></button>
                    </div>
                </li>
            `;

        $('#file_area').append(html);
        $('.tot_size').text(totalFileSize.toFixed(2) + "MB");
    }

    // 업로드 파일 삭제
    //function deleteFile(fIndex) {
    $("#delete").on('click', function (e){ 

        const fIndex = $("#delete").val();
        // 전체 파일 사이즈 수정
        totalFileSize -= fileSizeList[fIndex];

        // 파일 배열에서 삭제
        delete fileList[fIndex];

        // 파일 사이즈 배열 삭제
        delete fileSizeList[fIndex];

        // 업로드 파일 테이블 목록에서 삭제
        $("#fileTr_" + fIndex).remove();
        $('.tot_size').text(totalFileSize.toFixed(2) + "MB");

        //file 찾기 val 리셋
        $("#file_btn").val('');
    })

    // 수정화면 파일 삭제
    $("#o_delete").on('click', function (e){ 
        const fIndex = $("#delete").val();
        // 전체 파일 사이즈 수정
        totalFileSize -= newSizeList[fIndex];

        // 파일 사이즈 배열 삭제
        delete newSizeList[fIndex];

        deleteList[fIndex] = $("#o_delete").val();

        // 업로드 파일 테이블 목록에서 삭제
        $("#fileOrg_" + fIndex).remove();
        $('.tot_size').text(totalFileSize.toFixed(2) + "MB");

        //file 찾기 val 리셋
        $("#file_btn").val('');
    })

    // 파일 등록
    function uploadFile() {
        // 등록할 파일 리스트
        return new Promise((resolve, reject) => {
    
            const uploadFileList = [...fileList];
            
            if(deleteList.length>0){
                Promise.all(deleteList.map(file => {
                    if(file){
                        return fileService.delete(file)

                    }
                }))
                .then((data) => {
                    
                })
                .catch((err) => {
                    console.error(err)
                    m_reset();
                    return reject();
                })
            }

            // 파일이 있는지 체크
            if (uploadFileList.length > 0 && $(".newArea").length>0) {

                Promise.all(uploadFileList.map(file => {
                    FunLoadingBarStart(); 
                    if(file){
                        return videoService.createFile($("#his_id").val(), file)
                    }
                }))
                    .then((data) => {
                        if(data){
                            FunLoadingBarEnd();
                            resolve();
                        }
                        
                    })
                    .catch((err) => {
                        console.error(err)
                        m_reset();
                        return reject();
                    })

            }else{
                resolve();
            }
        })    
            
    }
    $("#set").on('click', function () {
        if($(this).val().indexOf('file')== -1){
            m_reset();
        }else{
            $("#fileList_area").html('');
            videoService.retrieve($("#his_id").val())
            .then((datas) => {
                if (datas && datas.files.length > 0) {
                    $.each(datas.files, function (idx, data) {
                        var fileSizeKb = data.file_size / 1024; // 파일 사이즈(단위 :kb)
                        var fileSizeMb = fileSizeKb / 1024;    // 파일 사이즈(단위 :Mb)
                        var fileSizeStr = "";
                        if ((1024 * 1024) <= data.file_size) {    // 파일 용량이 1메가 이상인 경우 
                            fileSizeStr = fileSizeMb.toFixed(2) + " MB";
                        } else if ((1024) <= data.file_size) {
                            fileSizeStr = parseInt(fileSizeKb) + " KB";
                        } else {
                            fileSizeStr = parseInt(data.file_size) + " byte";
                        }
                        totalFileSize += fileSizeMb;
                            
                        // 파일 사이즈 배열에 넣기
                        newSizeList[idx] = fileSizeMb;
                        if($("#set").val() == 'file'){
    
                            var html = `
                                <li id="fileOrg_${idx}">
                                    <div class="file-name orgArea">
                                        <span class="check style1">
                                            <input type="checkbox" name="sFileCheck" >
                                            <label for="sFileCheck5"><span>${data.original_name}</span></label>
                                        </span>
                                    </div>
                                    <div class="file-info">
                                        <em class="byte">${fileSizeStr}</em>
                                        <button type="button" class="btn btn-remove" onclick="go_o_delete(${idx}, '${data.id}')" return false;'><span>파일삭제</span></button>
                                    </div>
                                </li>
                            `;
    
                            $('#file_area').append(html);

                        }else{
                            ui.popup.open('popupFileAttach');
                            var html = `
                            <li>
                                <div class="file-name">
                                    <span class="check style1">
                                        <label for="sFileCheck1"><span><a href="/api/file/${data.id}/download">${data.original_name}</a></span></label>
                                    </span>
                                </div>
                                <div class="file-info">
                                    <em class="byte">${fileSizeStr}</em>
                                </div>
                            </li>
                            `;
                            $("#fileList_area").append(html);
                        }

                    })
                        $('.tot_size').text(totalFileSize.toFixed(2) + "MB");
                } 
                
            })
            .catch((err) => {
                console.error(err)
            })
        }
        
    })

    function m_reset() {
        
        fileList = new Array();
        fileSizeList = new Array();
        newSizeList = new Array();
        deleteList = new Array();
        
        totalFileSize = 0;
        fileIndex = 0;
        $('.tot_size').text('0MB');
        $('#file_area').html('');
        //파일 리스트 영역  reset
        $("#his_id").val('');
        $("#op_log").val('');
        $("#org_title").val('');

        $("#sLabelPop1").val('');
        $("#sLabelPop4 option:eq(0)").prop('selected', 'selected');
        $("#sLabelPop5 option:eq(0)").prop('selected', 'selected');
        $("#text_area").val('');
        
        $("#file_btn").val('');

    }
});