# 무신사 제품 재입고 모니터링 프로그램

라인과 카카오 API에서 각각 봇 토큰과 로그인 토큰을 발급받아서 재고가 있을 시에 채팅으로 메시지를 보내주는 프로그램입니다.

puppeteer를 사용해서 el.textContent태그를 찾아 모든 사이즈의 품절 상태를 확인했고, 모든 사이즈 중 하나라도 재고가 있다면 option 태그를 찾아서 내가 설정해둔 사이즈의 품절 상태까지 체크합니다.

재고가 있을 경우 라인과 카카오톡으로 각각 메세지를 발송합니다.

