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
    initMockupTabs();

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

  document.querySelectorAll('.mockup-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      const mockupId = item.getAttribute('data-mockup');

      if (mockupId) {
        openModal(Number(mockupId));
      }
    });

    item.style.cursor = 'pointer';
  });
});

function initMockupTabs() {
  const tabButtons = modalContent.querySelectorAll(".detail-content__tab-button");
  const tabPanes = modalContent.querySelectorAll(".detail-content__tab-pane");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.dataset.tab;

      tabButtons.forEach((btn) => btn.classList.remove("is-active"));
      tabPanes.forEach((pane) => pane.classList.remove("is-active"));

      button.classList.add("is-active");

      const selectedPane = modalContent.querySelector(
        `.detail-content__tab-pane[data-pane="${tabName}"]`
      );

      selectedPane?.classList.add("is-active");
    });
  });
}