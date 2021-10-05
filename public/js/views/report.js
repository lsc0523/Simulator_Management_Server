import videoService from '../services/rest/videocallService.mjs';

// chart color define
const backgroundColorMap = ['rgba(165, 00, 52, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)'];
const borderColorMap = [
    'rgba(165, 00, 52, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'];

const report = {

    init: function () {
        const backgroundColors = backgroundColorMap.slice();
        const borderColors = borderColorMap.slice();


        const ctx1 = document.getElementById('chart1');
        const chart1 = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    label: '# 1 of Chart',
                    data: [],
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 0.5
                }]
            },
            options: {
                showAllTooltips: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: '지역별 원격지원 현황 (단위:건)',
                    fontSize: 13, // 타이틀 글자 크기
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        fontSize: 10, // 범례 글자 크기
                        fontColor: '#000000',
                        fontStyle: 'bold'
                    }
                }
            }
        });

        var ctx2 = document.getElementById('chart2');
        var chart2 = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    label: '# 2 of Chart',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 0.5
                }]
            },
            options: {
                showAllTooltips: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: '지역별 원격지원 현황 (단위:분)',
                    fontSize: 13,
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        fontSize: 10,
                        fontColor: '#000000',
                        fontStyle: 'bold'
                    }
                }
            }
        });

        const ctx3 = document.getElementById('chart3');
        const chart3 = new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: [],
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 0.5
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    text: '유형별 원격지원 현황 (단위:건)',
                    fontSize: 13, // 타이틀 글자 크기
                    padding: 15,
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        fontSize: 10, // 범례 글자 크기
                        fontColor: '#000000',
                        fontStyle: 'bold'
                    }
                }
            }
        });

        const ctx4 = document.getElementById('chart4');
        const chart4 = new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: [],
                    data: [],
                    backgroundColor: [
                        // 'rgba(165, 00, 52, 0.6)','rgba(165, 00, 52, 0.6)','rgba(165, 00, 52, 0.6)','rgba(165, 00, 52, 0.6)','rgba(165, 00, 52, 0.6)',
                    ],
                    borderColor: [
                        // 'rgba(165, 00, 52, 1)','rgba(165, 00, 52, 1)','rgba(165, 00, 52, 1)','rgba(165, 00, 52, 1)','rgba(165, 00, 52, 1)',
                    ],
                    borderWidth: 0.5
                },
                ]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    text: '유형별 원격지원 현황 (단위:분)',
                    fontSize: 13, // 타이틀 글자 크기
                    padding: 15,
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        fontSize: 10, // 범례 글자 크기
                        fontColor: '#000000',
                        fontStyle: 'bold'
                    }
                }
            }
        });

        function addRingChartData(chart, label, data) {
            var newBackgroundColor = backgroundColorMap[chart.data.datasets[0].data.length % backgroundColorMap.length];
            var newBorderColor = borderColorMap[chart.data.datasets[0].data.length % borderColorMap.length];

            chart.data.labels.push(label);  // 출력 라벨 이름
            chart.data.datasets.forEach((dataset) => {
                dataset.backgroundColor.push(newBackgroundColor);     // 랜텀 색상
                dataset.borderColor.push(newBorderColor);
                dataset.data.push(data);
            });
            chart.update();
        }

        function addBarChartDataset(chart, labels) {

            if (labels.length > 0) {
                for (let index = 0; index < labels.length; ++index) {
                    if (index === 0) {
                        chart.data.datasets.pop();    // 최초 등록된 셈플데이터를 삭제한다.
                    }
                    var newBackgroundColor = backgroundColorMap[chart.data.datasets.length % backgroundColorMap.length];
                    var newBorderColor = borderColorMap[chart.data.datasets.length % borderColorMap.length];
                    var newDataset = {
                        label: labels[index], // 하단 범례
                        backgroundColor: newBackgroundColor,
                        borderColor: newBorderColor,
                        borderWidth: 0.5,
                        data: []
                    };                    
                    chart.data.datasets.push(newDataset);
                }
            }
            chart.update();
        }

        function addBarChartData(chart, region, data) {
            if (data.length > 0) {
                for (let index = 0; index < data.length; ++index) {
                    chart.data.datasets[index].data.push(data[index]);
                }
            }
            chart.data.labels.push(region);
            chart.update();
        }

        var options = {
            startDate: $("#sFormDate_report").val().replaceAll('-', ''),
            endDate: $("#sUntilDate_report").val().replaceAll('-', '')
        }
        videoService.retrieveStatistic(options)
            .then(({
                countByRegion,
                timeByRegion,
                countByType,
                timeByType,
                regionList,
                typeList }) => {

                for (const region in countByRegion) {
                    addRingChartData(chart1, region, countByRegion[region]);
                }
                for (const region in timeByRegion) {
                    addRingChartData(chart2, region, Math.round(timeByRegion[region] / 60));
                }
                addBarChartDataset(chart3, typeList);
                for (const region in countByType) {
                    const dataList = [];
                    typeList.forEach((type) => {
                        dataList.push(countByType[region][type] || 0)
                    });
                    addBarChartData(chart3, region, dataList);
                }
                addBarChartDataset(chart4, typeList);
                for (const region in timeByType) {
                    const dataList = [];
                    typeList.forEach((type) => {
                        dataList.push(timeByType[region][type] ? Math.round(timeByType[region][type] / 60) : 0)
                    });
                    addBarChartData(chart4, region, dataList);
                }
            })


        // Ring 사용 예제
        // addRingChartData(chart1, '오창', 10);
        // addRingChartData(chart1, 'ESMI', 20);
        // addRingChartData(chart1, 'ESNJ', 30);
        // addRingChartData(chart1, 'ESWA', 40);
        // addRingChartData(chart1, 'ESNB', 50);

        // // Ring 사용 예제
        // addRingChartData(chart2, '오창', 140);
        // addRingChartData(chart2, 'ESMI', 310);
        // addRingChartData(chart2, 'ESNJ', 210);
        // addRingChartData(chart2, 'ESWA', 410);
        // addRingChartData(chart2, 'ESNB', 220);

        // // BAR 사용 예제
        // addBarChartDataset(chart3, ['단순문의', '설비장애', '통신장애', '장비설치']); // 범례 항목 등록
        // addBarChartData(chart3, '오창', [10, 20, 30, 4]);  // 지역별 범례 항목에 대한 값 각각 등록
        // addBarChartData(chart3, 'ESMI', [12, 22, 33, 43]);
        // addBarChartData(chart3, 'ESNJ', [15, 25, 35, 45]);
        // addBarChartData(chart3, 'ESWA', [50, 40, 30, 20]);
        // addBarChartData(chart3, 'ESNB', [10, 20, 30, 40]);


        // // BAR 사용 예제
        // addBarChartDataset(chart4, ['단순문의', '설비장애', '통신장애', '장비설치']); // 범례 항목 등록
        // addBarChartData(chart4, '오창', [130, 230, 330, 30]);  // 지역별 범례 항목에 대한 값 각각 등록
        // addBarChartData(chart4, 'ESMI', [210, 120, 319, 405]);
        // addBarChartData(chart4, 'ESNJ', [176, 255, 317, 250]);
        // addBarChartData(chart4, 'ESWA', [520, 430, 321, 100]);
        // addBarChartData(chart4, 'ESNB', [450, 205, 320, 202]);


    }
}


$(function () {
    report.init();

    $("#report_search").on('click',function(){
        report.init();
    })
});