/**
 * 포트폴리오 상세 모달 기능
 * Team1의 상세 정보를 모달로 표시합니다.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 전역 스크롤 위치 저장 (모든 모달이 공유)
  if (!window.portfolioScrollPosition) {
    window.portfolioScrollPosition = 0;
  }

  // 스크롤바 너비 계산
  const getScrollbarWidth = () => {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  };

  // ========================================
  // 모달 관련 요소 선택
  // ========================================
  const modal = document.getElementById("projectModal");
  const modalContent = document.getElementById("modalContent");
  const closeButton = document.getElementById("closeProjectModal");
  const openTeam1Button = document.getElementById("openTeam1Modal");

  // ========================================
  // 상세 콘텐츠 캐시 (성능 최적화)
  // 한 번 로드한 후 재사용
  // ========================================
  let detailCache = null;

  /**
   * team.html에서 상세 콘텐츠를 가져오는 함수
   * @param {string} type - 'team1'
   */
  const loadDetailContent = async (type) => {
    try {
      const response = await fetch("team.html");
      if (!response.ok) {
        throw new Error("상세 내용을 불러오지 못했습니다.");
      }
      const html = await response.text();

      // HTML 문자열을 DOM으로 파싱
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // team1 콘텐츠 캐시에 저장
      detailCache = {
        team1: doc.querySelector("#team1Detail")?.outerHTML || "",
      };

      // 선택된 타입의 콘텐츠를 모달에 표시
      renderModalContent(type, "team");
    } catch (error) {
      console.error("콘텐츠 로드 오류:", error);
      modalContent.innerHTML =
        '<p class="modal-error">상세 내용을 불러오지 못했습니다.</p>';
      showModal();
    }
  };

  /**
   * 모달 열기 함수
   * team.html에서 콘텐츠를 로드하고 모달을 표시합니다.
   * @param {string} type - 'team1'
   */
  const openModal = (type) => {
    // 이미 로드한 콘텐츠가 있으면 캐시에서 가져옴
    if (detailCache) {
      renderModalContent(type, "team");
    } else {
      // 처음 로드할 때만 fetch 실행
      loadDetailContent(type);
    }
  };

  /**
   * 모달 콘텐츠를 렌더링하는 함수
   * 선택된 타입의 콘텐츠를 모달에 삽입하고 표시합니다.
   * @param {string} type - 콘텐츠 타입
   * @param {string} source - 'team'
   */
  const renderModalContent = (type, source = "team") => {
    let content = "";

    if (source === "team") {
      content = detailCache?.team1;
    }

    // 모달에 콘텐츠 삽입
    modalContent.innerHTML =
      content || '<p class="modal-error">상세 정보를 찾을 수 없습니다.</p>';

    // 탭 기능 초기화
    initTabs();

    // 모달 표시
    showModal();
  };

  /**
   * 탭 기능 초기화
   * 탭 버튼의 클릭 이벤트를 등록합니다.
   */
  const initTabs = () => {
    const tabButtons = modalContent.querySelectorAll(
      ".detail-content__tab-button",
    );
    const tabPanes = modalContent.querySelectorAll(".detail-content__tab-pane");

    // 각 탭 버튼에 클릭 이벤트 등록
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabName = button.getAttribute("data-tab");

        // 모든 탭 버튼에서 active 클래스 제거
        tabButtons.forEach((btn) => btn.classList.remove("is-active"));

        // 모든 탭 패널 숨기기
        tabPanes.forEach((pane) => pane.classList.remove("is-active"));

        // 선택된 탭 버튼에 active 클래스 추가
        button.classList.add("is-active");

        // 선택된 탭 패널 표시
        const selectedPane = modalContent.querySelector(
          `.detail-content__tab-pane[data-pane="${tabName}"]`,
        );
        if (selectedPane) {
          selectedPane.classList.add("is-active");
        }
      });
    });
  };

  let modalOpenScrollY = 0;

  function lockBodyScroll() {
    modalOpenScrollY = window.scrollY || window.pageYOffset;

    document.body.style.position = "fixed";
    document.body.style.top = `-${modalOpenScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.classList.add("modal-open");
  }

  function unlockBodyScroll() {
    document.body.classList.remove("modal-open");

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";

    window.scrollTo(0, modalOpenScrollY);
  }
  window.lockProjectModalScroll = lockBodyScroll;
  window.unlockProjectModalScroll = unlockBodyScroll;

  const showModal = () => {
    lockBodyScroll();

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    setTimeout(() => {
      closeButton?.focus();
    }, 100);
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    unlockBodyScroll();
  };

  /**
   * 모달 내부 스크롤 위치 초기화
   * 모달이 열릴 때마다 스크롤을 맨 위로 이동
   */
  const resetScroll = () => {
    if (modal && modal.querySelector(".modal-dialog")) {
      modal.querySelector(".modal-dialog").scrollTop = 0;
    }
  };

  // ========================================
  // 이벤트 리스너 등록
  // ========================================

  // Team1 버튼 클릭 이벤트
  openTeam1Button?.addEventListener("click", () => {
    openModal("team1");
    resetScroll();
  });

  // 닫기 버튼 클릭 이벤트
  closeButton?.addEventListener("click", closeModal);

  // 배경 클릭 시 모달 닫기 (overlay 클릭)
  modal?.addEventListener("click", (event) => {
    // modal-overlay 자체를 클릭했을 때만 닫기
    if (event.target === modal) {
      closeModal();
    }
  });

  // ESC 키 눌렀을 때 모달 닫기
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  // ========================================
  // 터치 스크롤 최적화 (모바일)
  // ========================================
  if ("ontouchstart" in window) {
    modal?.addEventListener("touchmove", (event) => {
      // 모달 내부 스크롤만 허용
      const modalDialog = modal.querySelector(".modal-dialog");
      if (modalDialog && event.target === modal) {
        event.preventDefault();
      }
    });
  }
});
