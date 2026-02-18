// ======================
// โหลดข้อมูล
// ======================

let repairs = JSON.parse(localStorage.getItem("repairs")) || [];

let editIndex = -1;

// ======================
// อ้างอิง elements
// ======================

const form = document.getElementById("repair-form");

const repairDate = document.getElementById("repair-date");
const customerName = document.getElementById("customer-name");
const phoneNumber = document.getElementById("phone-number");
const phoneModel = document.getElementById("phone-model");
const problemInput = document.getElementById("problem");
const priceInput = document.getElementById("price");
const costInput = document.getElementById("cost");
const statusInput = document.getElementById("status");

const repairList = document.getElementById("repair-list");

const pendingCount = document.getElementById("pending-count");
const repairingCount = document.getElementById("repairing-count");
const doneCount = document.getElementById("done-count");
const totalIncome = document.getElementById("total-income");

// ======================
// ตั้งค่าวันเริ่มต้น
// ======================

if (repairDate)
repairDate.valueAsDate = new Date();

// ======================
// สร้าง Job ID
// ======================

function generateJobID(){

    return "JOB-" + Date.now();

}

// ======================
// บันทึกข้อมูล
// ======================

function save(){

    localStorage.setItem("repairs", JSON.stringify(repairs));

}

// ======================
// แสดงข้อมูล
// ======================

function display(){

    if (!repairList) return;

    repairList.innerHTML = "";

    repairs.forEach((r,index)=>{

        // แสดงปุ่มใบเสร็จเฉพาะงานที่เสร็จแล้ว
        const receiptBtn =
        r.status === "เสร็จแล้ว"
        ?
        `<button onclick="printReceipt(${index})" class="btn-view">
        ใบเสร็จ
        </button>`
        :
        "";

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${r.jobID || "-"}</td>
        <td>${r.date || "-"}</td>
        <td>
<span onclick="viewCustomer('${r.customer}')"
style="color:blue;cursor:pointer;text-decoration:underline;">
${r.customer || "-"}
</span>
</td>

        <td>${r.model || "-"}</td>
        <td>${r.price || "0"}</td>
        <td>${r.status || "-"}</td>

        <td>

        <button onclick="viewDetail(${index})" class="btn-view">
        ดู
        </button>

        ${receiptBtn}

        <button onclick="editRepair(${index})" class="btn-edit">
        แก้ไข
        </button>

        <button onclick="deleteRepair(${index})" class="btn-delete">
        ลบ
        </button>

        </td>
        `;

        repairList.appendChild(row);

    });

    updateDashboard();

}


// ======================
// Dashboard
// ======================

function updateDashboard(){

    let pending=0;
    let repairing=0;
    let done=0;
    let income=0;

    repairs.forEach(r=>{

        if(r.status==="รอซ่อม") pending++;
        if(r.status==="กำลังซ่อม") repairing++;
        if(r.status==="เสร็จแล้ว") done++;

        income += Number(r.price) || 0;

    });

    if(pendingCount) pendingCount.textContent = pending;
    if(repairingCount) repairingCount.textContent = repairing;
    if(doneCount) doneCount.textContent = done;
    if(totalIncome) totalIncome.textContent = income;

}

// ======================
// เพิ่ม / แก้ไข งาน
// ======================

if (form){

form.addEventListener("submit", function(e){

    e.preventDefault();

    const data = {

        jobID: editIndex === -1
        ? generateJobID()
        : repairs[editIndex].jobID,

        date: repairDate.value,

        customer: customerName.value,

        phone: phoneNumber.value,

        model: phoneModel.value,

        problem: problemInput.value,

        price: priceInput.value,

        cost: costInput.value,

        status: statusInput.value

    };

    if(editIndex === -1){

        repairs.push(data);

    }else{

        repairs[editIndex] = data;
        editIndex = -1;

    }

    save();
    display();

    form.reset();

    repairDate.valueAsDate = new Date();

});

}

// ======================
// ลบ
// ======================

function deleteRepair(index){

    if(confirm("ลบงานนี้?")){

        repairs.splice(index,1);

        save();
        display();

    }

}

// ======================
// แก้ไข
// ======================

function editRepair(index){

    const r = repairs[index];

    repairDate.value = r.date || "";
    customerName.value = r.customer || "";
    phoneNumber.value = r.phone || "";
    phoneModel.value = r.model || "";
    problemInput.value = r.problem || "";
    priceInput.value = r.price || "";
    costInput.value = r.cost || "";
    statusInput.value = r.status || "";

    editIndex = index;

}

// ======================
// ดูรายละเอียด
// ======================

function viewDetail(index){

    const r = repairs[index];

    const price = Number(r.price) || 0;
    const cost = Number(r.cost) || 0;
    const profit = price - cost;

    const detailContent =
    document.getElementById("detail-content");

    detailContent.innerHTML = `

    <p><b>Job ID:</b> ${r.jobID}</p>

    <p><b>วันที่:</b> ${r.date}</p>

    <p><b>ลูกค้า:</b> ${r.customer}</p>

    <p><b>เบอร์:</b> ${r.phone}</p>

    <p><b>รุ่น:</b> ${r.model}</p>

    <p><b>อาการ:</b> ${r.problem}</p>

    <p><b>ราคา:</b> ${price}</p>

    <p><b>ต้นทุน:</b> ${cost}</p>

    <p><b>กำไร:</b> ${profit}</p>

    <p><b>สถานะ:</b> ${r.status}</p>

    `;

    document
    .getElementById("side-panel")
    .classList.add("open");

}


// ======================
// ปิด panel
// ======================

function closePanel(){

    const panel =
    document.getElementById("side-panel");

    if(panel)
    panel.classList.remove("open");

}

// ======================
// ค้นหา
// ======================

const search =
document.getElementById("search");

if(search){

search.addEventListener("input", function(){

    const keyword =
    this.value.toLowerCase();

    document
    .querySelectorAll("#repair-list tr")
    .forEach(row=>{

        row.style.display =
        row.innerText
        .toLowerCase()
        .includes(keyword)
        ? ""
        : "none";

    });

});

}

// ======================
// โหลดตอนเปิดเว็บ
// ======================

window.addEventListener("load", function(){

    display();

});

// ======================
// ระบบอะไหล่
// ======================

let parts = JSON.parse(localStorage.getItem("parts")) || [];

let partEditIndex = -1;

const partForm = document.getElementById("part-form");
const partNameInput = document.getElementById("part-name");
const partQtyInput = document.getElementById("part-qty");
const partList = document.getElementById("part-list");

function saveParts(){

localStorage.setItem("parts", JSON.stringify(parts));

}

function displayParts(){

if(!partList) return;

partList.innerHTML="";

parts.forEach((p,index)=>{

const row=document.createElement("tr");

row.innerHTML=`

<td>${p.name}</td>

<td>${p.qty}</td>

<td>

<button onclick="editPart(${index})" class="btn-edit">
แก้ไข
</button>

<button onclick="deletePart(${index})" class="btn-delete">
ลบ
</button>

</td>

`;

partList.appendChild(row);

});

}

if(partForm){

partForm.addEventListener("submit", function(e){

e.preventDefault();

const data={

name: partNameInput.value,

qty: partQtyInput.value

};

if(partEditIndex===-1){

parts.push(data);

}else{

parts[partEditIndex]=data;
partEditIndex=-1;

}

saveParts();

displayParts();

partForm.reset();

});

}

function editPart(index){

const p=parts[index];

partNameInput.value=p.name;
partQtyInput.value=p.qty;

partEditIndex=index;

}

function deletePart(index){

if(confirm("ลบอะไหล่นี้?")){

parts.splice(index,1);

saveParts();

displayParts();

}

}

// โหลดตอนเปิดเว็บ

displayParts();

function printReceipt(index){

const r = repairs[index];

const win = window.open("", "", "width=400,height=600");

win.document.write(`

<html>

<head>

<title>ใบเสร็จ</title>

<style>

body{
font-family:Arial;
padding:20px;
}

.center{
text-align:center;
}

hr{
margin:10px 0;
}

.big{
font-size:18px;
font-weight:bold;
}

</style>

</head>

<body>

<div class="center big">
Fix & Pub
</div>

<div class="center">
ใบเสร็จรับเงิน
</div>

<hr>

<p>เลขที่: ${r.jobID}</p>

<p>วันที่: ${r.date}</p>

<hr>

<p>ลูกค้า: ${r.customer}</p>

<p>เบอร์: ${r.phone}</p>

<hr>

<p>รายการ: ซ่อม ${r.model}</p>

<p>อาการ: ${r.problem}</p>

<hr>

<p class="big">
จำนวนเงิน: ${r.price} บาท
</p>

<hr>

<div class="center">
ขอบคุณที่ใช้บริการ
</div>

</body>

</html>

`);

win.document.close();

win.print();

}

function viewCustomer(name){

const customerJobs =
repairs.filter(r => r.customer === name);

let html = `<h3>ประวัติ: ${name}</h3><hr>`;

customerJobs.forEach(r=>{

const profit =
(Number(r.price)||0) -
(Number(r.cost)||0);

html += `

<p>
<b>${r.jobID}</b><br>
วันที่: ${r.date}<br>
รุ่น: ${r.model}<br>
ราคา: ${r.price}<br>
กำไร: ${profit}<br>
สถานะ: ${r.status}
</p>

<hr>

`;

});

document.getElementById("detail-content").innerHTML = html;

document.getElementById("side-panel")
.classList.add("open");

}

function deleteFinished(){

if(!confirm("ต้องการลบงานที่เสร็จแล้วทั้งหมด?")) return;

repairs = repairs.filter(r => r.status !== "เสร็จแล้ว");

localStorage.setItem("repairs", JSON.stringify(repairs));

display();

}
