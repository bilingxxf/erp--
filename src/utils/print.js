import { getLodop } from './LodopFuncs'

let LODOP
function getLODOP() {
  return new Promise((resolve, reject) => {
    try {
      LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'))
      LODOP.PRINT_INIT('') /* 初始化*/
      resolve()
    } catch (e) {
      console.log(e)
      download()
      reject()
    }
  })
}

function download() {
  try {
    const elem = document.createElement('iframe')
    elem.src = '../../../../../assets/printtool.rar'
    elem.style.display = 'none'
    document.body.appendChild(elem)
  } catch (e) {
    console.log('下载异常')
  }
}

export function printSteelPlateLabel({ length, width, thickness, material, projectName, qrCode }) {
  getLODOP().then(() => {
    const strHtml =
    `<!DOCTYPE html>
      <head>
        <style type="text/css">
          table {
            border-collapse: collapse;
            font-family:'微软雅黑';
            border-collapse:collapse;
            text-align: center;
            vertical-align:middle;
            font-size: 9pt;
            color: black;
          }
          table td {
            border: solid 0.5pt black;
          }
        </style>
      </head>
      <body>
        <table cellspacing="0" cellpadding="0" border="0" frame="void">
          <tbody>
            <tr>
                <td style="padding: 0 8pt;box-sizing:border-box;height: 6.4mm;width: 58mm;font-size: 12pt;" colspan="2;">${length} * ${width} * ${thickness}</td>
                <td style="padding: 0 8pt;box-sizing:border-box;height: 8.4mm;width: 16mm;" rowspan="2">
                </td>
            </tr>
            <tr>
                <td style="box-sizing:border-box;height: 2mm;width: 29mm;">材质：${material}</td>
                <td style="box-sizing:border-box;height: 2mm;width: 29mm;">${projectName}</td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>`
    LODOP.SET_PRINT_PAGESIZE(1, 800, 120, '1') /* 纸张大小*/
    LODOP.ADD_PRINT_HTM('1mm', '3mm', '100%', '100%', strHtml)
    LODOP.ADD_PRINT_BARCODE('1.5mm', '64.1mm', '14mm', '14mm', 'QRCode', qrCode)
    LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion', 5)
    LODOP.PRINT()
    // LODOP.PREVIEW()/* 打印预览*/
  })
}

export function printSteelLabel({ specification, material, projectName, qrCode }) {
  getLODOP().then(() => {
    const strHtml =
    `<!DOCTYPE html>
      <head>
        <style type="text/css">
          table {
            border-collapse: collapse;
            font-family:'微软雅黑';
            border-collapse:collapse;
            text-align: center;
            vertical-align:middle;
            font-size: 9pt;
            color: black;
          }
          table td {
            border: solid 0.5pt black;
          }
        </style>
      </head>
      <body>
        <table cellspacing="0" cellpadding="0" border="0" frame="void">
          <tbody>
            <tr>
                <td style="padding: 0 8pt;box-sizing:border-box;height: 6.4mm;width: 58mm;font-size: 12pt;" colspan="2;">${specification}</td>
                <td style="padding: 0 8pt;box-sizing:border-box;height: 8.4mm;width: 16mm;" rowspan="2">
                </td>
            </tr>
            <tr>
                <td style="box-sizing:border-box;height: 2mm;width: 29mm;">${material}</td>
                <td style="box-sizing:border-box;height: 2mm;width: 29mm;">${projectName}</td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>`
    LODOP.SET_PRINT_PAGESIZE(1, 800, 120, '1') /* 纸张大小*/
    LODOP.ADD_PRINT_HTM('1mm', '3mm', '100%', '100%', strHtml)
    LODOP.ADD_PRINT_BARCODE('1.5mm', ' 64.1mm', '14mm', '14mm', 'QRCode', qrCode)
    LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion', 5)
    LODOP.PRINT()
    // LODOP.PREVIEW()/* 打印预览*/
  })
}

export function printStripSteelLabel({ width, thickness, color, brand, projectName, qrCode }) {
  getLODOP().then(() => {
    const strHtml =
    `<!DOCTYPE html>
      <head>
        <style type="text/css">
          table {
            border-collapse: collapse;
            font-family:'微软雅黑';
            border-collapse:collapse;
            text-align: center;
            vertical-align:middle;
            font-size: 9pt;
            color: black;
          }
          table td {
            border: solid 0.5pt black;
          }
        </style>
      </head>
      <body>
        <table cellspacing="0" cellpadding="0" border="0" frame="void">
          <tbody>
            <tr>
                <td style="padding: 0 8pt;box-sizing:border-box;height: 6.4mm;width: 58mm;font-size: 12pt;" colspan="2;">${width} * ${thickness} &nbsp;<span style="display:inline-block;font-size:7pt;margin-top:1px">${color}</span></td>
                <td style="padding: 0 8pt;box-sizing:border-box;height: 8.4mm;width: 16mm;" rowspan="2">
                </td>
            </tr>
            <tr>
                <td style="box-sizing:border-box;height: 2mm;width: 29mm;">${brand}</td>
                <td style="box-sizing:border-box;height: 2mm;width: 29mm;">${projectName}</td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>`
    LODOP.SET_PRINT_PAGESIZE(1, 800, 120, '1') /* 纸张大小*/
    LODOP.ADD_PRINT_HTM('1mm', '3mm', '100%', '100%', strHtml)
    LODOP.ADD_PRINT_BARCODE('1.5mm', ' 64.1mm', '14mm', '14mm', 'QRCode', qrCode)
    LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion', 5)
    LODOP.PRINT()
    // LODOP.PREVIEW()/* 打印预览*/
  })
}

export function printEnclosureLabel({ specification, material, projectName, qrCode }) {
  getLODOP().then(() => {
    const strHtml =
    `<!DOCTYPE html>
      <head>
      <style type="text/css">
        table {
          border-collapse: collapse;
          font-family:'微软雅黑';
          border-collapse:collapse;
          text-align: center;
          vertical-align:middle;
          font-size: 9pt;
          color: black;
        }
        table td {
          border: solid 0.5pt black;
        }
      </style>
      </head>
      <body>
        <table cellspacing="0" cellpadding="0" border="0" frame="void">
          <tbody>
            <tr>
                <td style="padding: 0 8pt;box-sizing:border-box;height: 6.4mm;width: 58mm;font-size: 12pt;" colspan="2;">${material}</td>
                <td style="padding: 0 8pt;box-sizing:border-box;height: 8.4mm;width: 16mm;" rowspan="2">
                </td>
            </tr>
            <tr>
                <td style="box-sizing:border-box;height: 2mm;width: 29mm;">${specification}</td>
                <td style="box-sizing:border-box;height: 2mm;width: 29mm;">${projectName}</td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>`
    LODOP.SET_PRINT_PAGESIZE(1, 800, 120, '1') /* 纸张大小*/
    LODOP.ADD_PRINT_HTM('1mm', '3mm', '100%', '100%', strHtml)
    LODOP.ADD_PRINT_BARCODE('1.5mm', ' 64.1mm', '14mm', '14mm', 'QRCode', qrCode)
    LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion', 5)
    LODOP.PRINT()
    // LODOP.PREVIEW()/* 打印预览*/
  })
}

// 打印出库单
export function printOutboundOrder({ date, orderNo, list, number = 2 }) {
  if (!list || !list.length) return
  getLODOP().then(() => {
    let strHtml =
    `<!DOCTYPE html>
    <head>
      <style type="text/css">
      .list-container {
        font-size: 10pt;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 70mm;
      }
      .header-box {
        width: 100%;
        height: 18mm;
        font-size: 15pt;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
      }
      .table-box {
        width: 100%;
        box-sizing: border-box;
        padding: 2mm 2mm;
      }
      .table-box >table {
        text-align:center
      }
      .other-box {
        width: 100%;
        height: 16mm;
        box-sizing: border-box;
        padding: 1.5mm 2mm;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
        border-top:1pt dashed;
        border-bottom:1pt dashed;
      }
      .list-footer {
        width: 100%;
        height: 30mm;
        box-sizing: border-box;
        padding: 2mm 2mm;
        border-top:1pt dashed;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 20mm;
      }
      .list-footer >span {
        display: inline-block;
        width: 50%;
      }
      </style>
    </head>
    <body>
    <div class="list-container">
        <div class="header-box">
          <span>领料凭证</span>
        </div>
        <div class="other-box">
          <span>出库日期：${date}</span>
          <span>出库单号：${orderNo}</span>
        </div>
        <div class="table-box">
          <table id="tbl" border="0" width="100%" rules="none" frame="void">
            <tr>
              <th>序号</th>
              <th>编号</th>
              <th>规格</th>
              <th>单位</th>
              <th>数量</th>
            </tr>`
    for (const i in list) {
      strHtml += `<tr>
              <td>${Number(i) + 1}</td>
              <td>${list[i].materialCode}</td>
              <td>${list[i].newSpecification}</td>
              <td>${list[i].unit}</td>
              <td>${list[i].number}</td>
            </tr>`
    }
    strHtml += `
          </table>
        </div>
        <div class="list-footer">
          <span>办理人：</span>
          <span>领料人：</span>
        </div>
        <div>-</div>
      </div>
    </body>
  </html>`

    LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', strHtml)
    LODOP.SET_PRINT_COPIES(number)
    LODOP.PRINT()
  })
}
