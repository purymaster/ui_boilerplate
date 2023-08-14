(function($) {
	/******************** 탭메뉴 제어 ********************/
	function initTabMenu() {
		const tabMenus = $("[data-tab-menu]");
		const tabMenuItems = tabMenus.find("a, button");
		const tabPanels = $("[data-tab-panel]");

		tabMenus.each(function() {
			$(this)
				.find("a, button")
				.attr("aria-selected", false)
				.attr("tabindex", "-1")
				.eq(0)
				.attr("aria-selected", true)
				.attr("tabindex", "0")
				.addClass("on");
		});

		tabPanels.each(function() {
			$(this)
				.find(".tabpanel")
				.attr("aria-hidden", "true")
				.attr("tabindex", "-1")
				.hide()
				.eq(0)
				.attr("aria-hidden", "false")
				.attr("tabindex", "0")
				.show();
		});

		function showPanel($selectedTab) {
			const target = $(`#${$selectedTab.attr("aria-controls")}`);

			tabMenuItems.each(function() {
				const isSelected = $(this).attr("aria-controls") === target.attr("id");
				$(this).attr("aria-selected", isSelected);
				if (isSelected) {
					$(this)
						.attr("tabindex", "0")
						.addClass("on")
						.siblings()
						.attr("tabindex", "-1")
						.removeClass("on");
				}
			});

			target
				.attr("aria-hidden", "false")
				.attr("tabindex", "0")
				.show()
				.siblings()
				.attr("aria-hidden", "true")
				.attr("tabindex", "-1")
				.hide();
		}

		tabMenuItems
			.on("click", function(e) {
				showPanel($(this));
			})
			.on("keydown", function(e) {
				const keyMap = {
					13: function($this) {
						e.preventDefault();
						showPanel($this);
					},
					32: function($this) {
						e.preventDefault();
						showPanel($this);
					},
					37: function($this) {
						if ($this[0].previousElementSibling) {
							$this.attr("tabindex", "-1").prev().attr("tabindex", "0").focus();
						} else {
							$this
								.attr("tabindex", "-1")
								.siblings(":last")
								.attr("tabindex", "0")
								.focus();
						}
					},
					39: function($this) {
						if ($this[0].nextElementSibling) {
							$this.attr("tabindex", "-1").next().attr("tabindex", "0").focus();
						} else {
							$this
								.attr("tabindex", "-1")
								.siblings(":first")
								.attr("tabindex", "0")
								.focus();
						}
					},
				};

				if (Object.keys(keyMap).indexOf(e.keyCode.toString()) !== -1) {
					keyMap[e.keyCode]($(this));
				}
			});

		tabMenus.on("keydown", function(e) {
			if (e.shiftKey && e.keyCode === 9) {
				const $selectedTab = $(this).find("a, button[aria-selected='true']");
				$selectedTab.focus();
			}
		});
	}

	/******************** 팝업 제어 ********************/
	function initModal() {
		const modal = $("[data-modal]");
		let isModal = false;
		let lastFocusedElement = null;
		let targetModal = null;

		function openModal(e) {
			e.preventDefault();
			isModal = true;
			lastFocusedElement = $(this);
			targetModal = $($(this).attr("href"));
			modal.removeClass("on");
			targetModal.addClass("on").find(".modal").focus();
		}

		function closeModal() {
			isModal = false;
			targetModal = targetModal || $(this).parents("[data-modal]");
			targetModal.removeClass("on");
			$("[data-video] iframe").attr("src", function() {
				return $(this).data("src");
			});
			lastFocusedElement?.focus();
		}

		function handleKeyDown(e) {
			const currentTabElement = document.activeElement;
			const firstTabElement = targetModal?.find(".modal").get(0);
			const lastTabElement = targetModal?.find(".close").get(0);

			const reverseTabPressed = e.shiftKey && e.keyCode === 9;
			const tabPressed = !e.shiftKey && e.keyCode === 9;
			const escapePressed = e.keyCode === 27;

			if (isModal) {
				if (reverseTabPressed && currentTabElement === firstTabElement) {
					e.preventDefault();
					lastTabElement.focus();
				}
				if (tabPressed && currentTabElement === lastTabElement) {
					e.preventDefault();
					firstTabElement.focus();
				}
				if (escapePressed) {
					isModal = false;
					closeModal();
				}
			}
		}

		$(document)
			.on("click", "[data-open-modal]", openModal)
			.on("click", "[data-modal] .close", closeModal)
			.on("keydown", handleKeyDown);
	}

	/******************** 팝업 쿠키 제어  ********************/
	function handlePopupCookies() {
		const getCookie = (cookie = "") => {
			const name = cookie + "=";
			const decodedCookie = decodeURIComponent(document.cookie);
			const cookieArray = decodedCookie.split(";");

			for (let i = 0; i < cookieArray.length; i++) {
				let c = cookieArray[i];
				while (c.charAt(0) == " ") {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		};

		const setCookie = (name = "", value = "", day = 1) => {
			const date = new Date();
			date.setTime(date.getTime() + day * 24 * 60 * 60 * 1000);
			const expires = `expires=${date.toUTCString()}`;
			document.cookie = `${name}=${value};${expires};path=/`;
		};

		$('[data-modal="popup"]').each(function() {
			const popup = $(this);
			const checkbox = popup.find('input[type="checkbox"]');
			const cookieName = checkbox.attr("id");
			const cookieValue = "hidden";
			const cookieDays = 1;

			const hidePopup = () => {
				popup.removeClass("on");
			};

			const showPopup = () => {
				popup.addClass("on");
				popup.find(".modal").focus();
			};

			if (checkbox.length && getCookie(cookieName)) {
				hidePopup();
			} else {
				showPopup();
			}

			checkbox.on("change", function() {
				if (this.checked) {
					setCookie(cookieName, cookieValue, cookieDays);
					hidePopup();
				}
			});
		});
	}

	/******************** 아코디언 메뉴 제어 ********************/

	function handleAccordionMenus() {
		const $accordion = $("[data-accordion] > div");
		$accordion.on("click", function() {
			$(this).toggleClass("on");
		});
	}

	$(() => {
		initTabMenu();
		initModal();
		handlePopupCookies();
		handleAccordionMenus();
	});
})(jQuery);