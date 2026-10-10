/**
 * Mockup 모달 기능
 * 목업 아이템 클릭 시 동적으로 모달 콘텐츠를 변경하고 표시합니다.
 */

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const closeButton = document.getElementById('closeProjectModal');

  // ========================================
  // Mockup 상세 콘텐츠 캐시
  // ========================================
  let detailCache = null;

  /**
   * mockup.html에서 상세 콘텐츠를 가져오는 함수
   * @param {number} id - mockup 번호 (1~7)
   */
  const loadMockupContent = async (id) => {
    try {
      // 최초 1회만 로드
      if (!detailCache) {
        const response = await fetch("mockup.html");

        if (!response.ok) {
          throw new Error("mockup.html을 불러오지 못했습니다.");
        }

        const html = await response.text();

        const parser = new DOMParser();
        detailCache = parser.parseFromString(html, "text/html");
      }

      const content = detailCache.querySelector(`#mockup${id}Detail`);

      modalContent.innerHTML = content
        ? content.outerHTML
        : '<p class="modal-error">상세 정보를 찾을 수 없습니다.</p>';

    } catch (error) {
      console.error(error);

      modalContent.innerHTML =
        '<p class="modal-error">상세 내용을 불러오지 못했습니다.</p>';
    }
  };

    const resetScroll = () => {
      const modalDialog = modal?.querySelector('.modal-dialog');
      if (modalDialog) {
        modalDialog.scrollTop = 0;
      }
    };

  const openModal = async (mockupId) => {
    if (!modal || !modalContent) return;

    await loadMockupContent(mockupId);

    resetScroll();

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    if (typeof window.lockProjectModalScroll === "function") {
      window.lockProjectModalScroll();
    }

    setTimeout(() => {
      closeButton?.focus();
    }, 100);
  };

  document.querySelectorAll('.mockup-item[data-clickable]').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      const mockupId = item.getAttribute('data-mockup');

      if (mockupId) {
        openModal(Number(mockupId));
      }
    });

    item.style.cursor = 'pointer';
  });

// Key Features Accordion
// 동적으로 삽입되는 mockup 콘텐츠 대응

  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;


  // 특정 feature 열기
  function openFeature(target) {

    // 현재 모달 안의 feature만 찾음
    const featureContainer = target.closest(".key-features");

    if (!featureContainer) return;

    const featureItems =
      featureContainer.querySelectorAll(".feature-item");


    // 기존 active 제거
    featureItems.forEach((item) => {
      item.classList.remove("active");
    });


    // 현재 항목 열기
    target.classList.add("active");
  }


  /* =========================
    PC - Hover
  ========================= */

  if (canHover) {

    modalContent.addEventListener("mouseover", (e) => {

      const item = e.target.closest(".feature-item");

      if (!item) return;

      // 같은 feature-item 내부에서 이동한 경우 무시
      if (
        e.relatedTarget &&
        item.contains(e.relatedTarget)
      ) {
        return;
      }

      openFeature(item);

    });

  }


  /* =========================
    Mobile / Tablet - Click
  ========================= */

  modalContent.addEventListener("click", (e) => {

    // PC에서는 클릭 이벤트 사용 X
    if (canHover) return;

    const summary = e.target.closest(".feature-summary");

    if (!summary) return;

    const item = summary.closest(".feature-item");

    if (!item) return;


    const featureContainer =
      item.closest(".key-features");

    const featureItems =
      featureContainer.querySelectorAll(".feature-item");


    const isOpen =
      item.classList.contains("active");


    featureItems.forEach((el) => {
      el.classList.remove("active");
    });


    if (!isOpen) {
      item.classList.add("active");
    }

  });
});