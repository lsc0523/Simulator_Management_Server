/**
* ecosystem.config.js
* - pm2를 이용해서 서비스 기동시 사용하는 환경설정 파일
**/
module.exports = {
  apps: [
    {
      name: "ar_assistant", // 이름. 나중에 이 이름으로 프로세스를 관리한다
      script: "./app.js", // 실행할 파일 경로
      autorestart: true, // 프로세스 실패 시 자동으로 재시작할지 선택
      watch: false, // 파일이 변경되었을 때 재시작 할지 선택
      max_memory_restart: "1024M", // 프로그램의 메모리 크기가 일정 크기 이상이 되면 재시작한다.
    }
  ]
};