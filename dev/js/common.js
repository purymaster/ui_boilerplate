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
			.on("click", function() {
				showPanel($(this));
			})
			.on("keydown", function(e) {
				const keyMap = {
					13: function($this) {
						if ($this.is("button")) {
							e.preventDefault();
							showPanel($this);
						}
					},
					32: function($this) {
						e.preventDefault();
						if ($this.is("button")) {
							showPanel($this);
						} else if ($this.is("a")) {
							if ($this.attr("target") === "_blank") {
								window.open($this.attr("href"));
							} else {
								window.location.href = $this.attr("href");
							}
						}
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

	/******************** 파일 업로드 제어 ********************/
	function isImageFile(fileName) {
		const imageExtensions = ["jpg", "jpeg", "png", "gif"];
		const extension = fileName.split(".").pop().toLowerCase();
		return imageExtensions.includes(extension);
	}

	function handleFileUpload() {
		let files = [];

		function updateUploadList($uploadList) {
			$uploadList.empty();
			files.forEach((file) => {
				const fileName = file.name;
				const listItem = $(`
					<li>
						<div class="img_wrap">
							<img src="" alt="" />
						</div>
						<i class="icon" data-feather="file" aria-hidden="true"></i>
						<div class="name">${fileName}</div>
						<button type="button" class="delete">
							<i class="icon" data-feather="x-circle" aria-hidden="true"></i>
							<span class="hidden">파일 업로드 취소</span>
						</button>
					</li>
				`);
				if (isImageFile(fileName)) {
					listItem.find(".img_wrap img").attr("src", URL.createObjectURL(file));
				} else {
					listItem.find(".img_wrap").hide();
				}
				$uploadList.append(listItem);
				feather.replace();
			});
		}

		function handleFileChange(e) {
			const newFiles = Array.from(e.target.files);
			if (e.target.multiple) {
				files = files.concat(newFiles);
			} else {
				files = newFiles;
			}
			const $uploadList = $(e.target).siblings(".file_list");
			updateUploadList($uploadList);
		}

		function handleFileDelete(e) {
			const listItem = $(e.target).closest("li");
			const fileIndex = listItem.index();
			files.splice(fileIndex, 1);
			listItem.remove();
		}

		$("[data-input='file']").each(function() {
			const $uploader = $(this).find("input[type='file']");
			const $uploadList = $(this).find(".file_list");

			$uploader.on("change", handleFileChange);
			$uploadList.on("click", ".delete", handleFileDelete);
		});
	}

	$(() => {
		initTabMenu();
		initModal();
		handlePopupCookies();
		handleAccordionMenus();
		handleFileUpload();
	});
})(jQuery);