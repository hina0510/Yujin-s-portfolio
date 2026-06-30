/**
 * 포트폴리오 상세 모달 기능
 * Team1 / Contact의 상세 정보를 모달로 표시합니다.
 */

document.addEventListener("DOMContentLoaded", () => {
  const dot = document.querySelector(".logo-dot");
  const splash = document.querySelector("#splash");
  const splashCover = document.querySelector(".splash-cover");
  const mainPage = document.querySelector(".portfolio-page");

  /**
   * SVG 안의 원은 SVG 영역 밖으로 커질 수 있어서 잘려 보입니다.
   * 그래서 원이 올라온 순간의 화면 좌표를 구한 뒤,
   * fixed 레이어(.splash-cover)를 그 위치에서 화면 전체로 확장합니다.
   */
  dot?.addEventListener("animationend", (e) => {
    if (e.animationName !== "riseDot") return;

    const dotRect = dot.getBoundingClientRect();
    const centerX = dotRect.left + dotRect.width / 2;
    const centerY = dotRect.top + dotRect.height / 2;

    splashCover?.style.setProperty("--cover-x", `${centerX}px`);
    splashCover?.style.setProperty("--cover-y", `${centerY}px`);
    splashCover?.classList.add("is-expand");

    // SVG 점과 fixed 원이 겹쳐 보이도록 한 뒤, SVG 점은 숨김
    dot.style.opacity = "0";
  });

  splashCover?.addEventListener("animationend", (e) => {
    if (e.animationName !== "coverExpand") return;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.location.hash = "#profile";

    mainPage?.classList.add("show");
    splash?.classList.add("hide");

    // 노란 화면이 잠깐 남았다가 사라지면서 메인으로 넘어감
    setTimeout(() => {
      splashCover.classList.add("is-hide");
    }, 120);
  });

  // ========================================
  // 모달 관련 요소 선택
  // ========================================
  const modal = document.getElementById("projectModal");
  const modalContent = document.getElementById("modalContent");
  const closeButton = document.getElementById("closeProjectModal");
  const openTeam1Button = document.getElementById("openTeam1Modal");
  const openContact1Button = document.getElementById("openContact1Modal");

  // ========================================
  // 상세 콘텐츠 캐시 (성능 최적화)
  // 한 번 로드한 후 재사용
  // ========================================
  let detailCache = null;
  let contactCache = null;

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
   * contact.html에서 연락처 콘텐츠를 가져오는 함수
   * @param {string} type - 'contact1'
   */
  const loadContactContent = async (type) => {
    try {
      const response = await fetch("contact.html");
      if (!response.ok) {
        throw new Error("연락처 정보를 불러오지 못했습니다.");
      }
      const html = await response.text();

      // HTML 문자열을 DOM으로 파싱
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // contact1 콘텐츠 캐시에 저장
      contactCache = {
        contact1: doc.querySelector("#contact1Detail")?.outerHTML || "",
      };

      // 선택된 타입의 콘텐츠를 모달에 표시
      renderModalContent(type, "contact");
    } catch (error) {
      console.error("콘텐츠 로드 오류:", error);
      modalContent.innerHTML =
        '<p class="modal-error">연락처 정보를 불러오지 못했습니다.</p>';
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
   * 연락처 모달 열기 함수
   * contact.html에서 콘텐츠를 로드하고 모달을 표시합니다.
   * @param {string} type - 'contact1'
   */
  const openContactModal = (type) => {
    // 이미 로드한 콘텐츠가 있으면 캐시에서 가져옴
    if (contactCache) {
      renderModalContent(type, "contact");
    } else {
      // 처음 로드할 때만 fetch 실행
      loadContactContent(type);
    }
  };

  /**
   * 모달 콘텐츠를 렌더링하는 함수
   * 선택된 타입의 콘텐츠를 모달에 삽입하고 표시합니다.
   * @param {string} type - 콘텐츠 타입
   * @param {string} source - 'team' 또는 'contact'
   */
  const renderModalContent = (type, source = "team") => {
    let content = "";

    if (source === "team") {
      content = detailCache?.team1;
    } else if (source === "contact") {
      content = contactCache?.contact1;
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

  /**
   * 모달을 화면에 표시하는 함수
   */
  const showModal = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    // 모달이 표시된 후 포커스를 닫기 버튼으로 이동
    setTimeout(() => {
      closeButton?.focus();
    }, 100);
  };

  /**
   * 모달을 숨기는 함수
   */
  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
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

  // Contact1 버튼 클릭 이벤트
  openContact1Button?.addEventListener("click", () => {
    openContactModal("contact1");
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
