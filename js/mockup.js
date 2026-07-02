/**
 * Mockup 모달 기능
 * 목업 아이템 클릭 시 동적으로 모달 콘텐츠를 변경하고 표시합니다.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 모달 관련 요소
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const closeButton = document.getElementById('closeProjectModal');

  // 모달 데이터 (확장 가능한 구조)
  const mockupData = {
    1: {
      title: 'Project 01',
      description: '첫 번째 프로젝트입니다.',
      // 나중에 추가 가능: image, link, tech, etc.
    },
    2: {
      title: 'Project 02',
      description: '두 번째 프로젝트입니다.',
    },
    3: {
      title: 'Project 03',
      description: '세 번째 프로젝트입니다.',
    },
    4: {
      title: 'Project 04',
      description: '네 번째 프로젝트입니다.',
    },
    5: {
      title: 'Project 05',
      description: '다섯 번째 프로젝트입니다.',
    },
    6: {
      title: 'Project 06',
      description: '여섯 번째 프로젝트입니다.',
    },
    7: {
      title: 'Project 07',
      description: '일곱 번째 프로젝트입니다.',
    },
  };

  /**
   * 모달 콘텐츠를 렌더링하는 함수
   * @param {number} mockupId - 모달에 표시할 프로젝트 ID
   */
  const renderModalContent = (mockupId) => {
    const data = mockupData[mockupId];

    if (!data) {
      modalContent.innerHTML = '<p class="modal-error">프로젝트 정보를 찾을 수 없습니다.</p>';
      return;
    }

    // 모달 콘텐츠 생성
    const html = `
      <div class="mockup-detail">
        <h2>${data.title}</h2>
        <p>${data.description}</p>
      </div>
    `;

    modalContent.innerHTML = html;
  };

  /**
   * 모달을 열기
   * @param {number} mockupId - 열 모달의 프로젝트 ID
   */
  const openModal = (mockupId) => {
    renderModalContent(mockupId);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // 모달 표시 후 닫기 버튼에 포커스
    setTimeout(() => {
      closeButton?.focus();
    }, 100);
  };

  /**
   * 모달을 닫기
   */
  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  /**
   * 모달 내부 스크롤 위치 초기화
   */
  const resetScroll = () => {
    if (modal && modal.querySelector('.modal-dialog')) {
      modal.querySelector('.modal-dialog').scrollTop = 0;
    }
  };

  // ========================================
  // 이벤트 리스너 등록
  // ========================================

  // Mockup 아이템 클릭 이벤트
  document.querySelectorAll('.mockup-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const mockupId = item.getAttribute('data-mockup');
      if (mockupId) {
        openModal(Number(mockupId));
        resetScroll();
      }
    });

    // 클릭 가능한 요소로 표시
    item.style.cursor = 'pointer';
  });

  // 닫기 버튼 클릭 이벤트
  closeButton?.addEventListener('click', closeModal);

  // 배경 클릭 시 모달 닫기 (overlay 클릭)
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // ESC 키 눌렀을 때 모달 닫기
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // 터치 스크롤 최적화 (모바일)
  if ('ontouchstart' in window) {
    modal?.addEventListener('touchmove', (event) => {
      const modalDialog = modal.querySelector('.modal-dialog');
      if (modalDialog && event.target === modal) {
        event.preventDefault();
      }
    });
  }
});
