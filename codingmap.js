$.getJSON("codingmap.json", function (data) {
  const $table = $(".map_table");
  const $tableCol = $table.find("colgroup");
  const $tableHead = $table.find("thead");
  const $tableBody = $table.find("tbody");

  function getMaxDepth(obj) {
    const depthKeys = Object.keys(obj)
      .filter((key) => key.includes("depth") && obj[key] !== "")
      .map((key) => parseInt(key.replace("depth", "")));
    return Math.max(...depthKeys, 0);
  }

  function generateTable() {
    const overallMaxDepth = data.reduce(
      (maxDepth, item) => Math.max(maxDepth, getMaxDepth(item)),
      0
    );

    const tableColRow = `
    <col style="width:40px;" />
    ${Array.from(
      { length: overallMaxDepth },
      (_) => `<col class="depth mobile" style="width:10%;" />`
    ).join("")}
    <col style="width:10%;" />
    <col />
    <col class="mobile" style="width:40px;" />
    `;

    $tableCol.append(tableColRow);

    const tableHeadRow = `
    <tr>
      <th class="num">No</th>
      ${Array.from(
        { length: overallMaxDepth },
        (_, index) => `<th class="depth">Depth${index + 1}</th>`
      ).join("")}
      <th class="id">ID</th>
      <th class="memo">Memo</th>
      <th class="link">Link</th>
    </tr>
    `;

    $tableHead.append(tableHeadRow);

    data.forEach(function (page, index) {
      const depthCells = Array.from({ length: overallMaxDepth }, (_, index) => {
        const depthKey = `depth${index + 1}`;
        const depthValue = page[depthKey] || "";
        return `<td class="depth">${depthValue}</td>`;
      }).join("");

      const tableBodyRow = `
      <tr>
        <td class="num center">${index + 1}</td>
        ${depthCells}
        <td class="id center">${page.id}</td>
        <td class="memo">${page.memo}</td>
        <td class="link center">
          <a href="dev/html/${
            page.id
          }.html" target="_blank" title="새창열림">보기</a>
        </td>
      </tr>
      `;

      $tableBody.append(tableBodyRow);
    });
  }

  generateTable();
});
