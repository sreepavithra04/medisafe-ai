// 💊 Drug Interaction Dataset
let interactions = [
    {d1: "aspirin", d2: "warfarin", risk: "high"},
    {d1: "ibuprofen", d2: "warfarin", risk: "high"},
    {d1: "aspirin", d2: "clopidogrel", risk: "high"},
    {d1: "paracetamol", d2: "alcohol", risk: "high"},
    {d1: "metformin", d2: "alcohol", risk: "medium"},
    {d1: "amoxicillin", d2: "methotrexate", risk: "medium"},
    {d1: "ibuprofen", d2: "prednisone", risk: "medium"},
    {d1: "paracetamol", d2: "ibuprofen", risk: "low"},
    {d1: "cetirizine", d2: "alcohol", risk: "medium"},
    {d1: "omeprazole", d2: "clopidogrel", risk: "medium"},
    {d1: "digoxin", d2: "verapamil", risk: "high"},
    {d1: "lisinopril", d2: "potassium", risk: "high"},
    {d1: "atorvastatin", d2: "grapefruit", risk: "medium"},
    {d1: "insulin", d2: "alcohol", risk: "high"},
    {d1: "azithromycin", d2: "antacid", risk: "low"},
    {d1: "doxycycline", d2: "milk", risk: "medium"},
    {d1: "warfarin", d2: "vitamin k", risk: "medium"},
    {d1: "aspirin", d2: "ibuprofen", risk: "medium"},
    {d1: "metformin", d2: "contrast dye", risk: "high"},
    {d1: "benzodiazepines", d2: "alcohol", risk: "high"}
];

// 💾 Load saved medicines
let medicines = JSON.parse(localStorage.getItem("meds")) || [];

// 💾 Save data
function saveData() {
    localStorage.setItem("meds", JSON.stringify(medicines));
}

// 📋 Display medicines
function renderList() {
    let list = document.getElementById("medicineList");
    list.innerHTML = "";

    medicines.forEach((m, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${m.name} ⏰ ${m.time}
        <button onclick="deleteMed(${index})">❌</button>`;
        list.appendChild(li);
    });
}

// ➕ Add medicine
function addMedicine() {
    let name = document.getElementById("medicineInput").value.trim();
    let time = document.getElementById("timeInput").value;

    if (name && time) {
        medicines.push({ name, time });
        saveData();
        renderList();
        scheduleReminder(name, time);

        document.getElementById("medicineInput").value = "";
    }
}

// ❌ Delete medicine
function deleteMed(index) {
    medicines.splice(index, 1);
    saveData();
    renderList();
}

// ⚠️ CHECK INTERACTIONS (FIXED + DATASET BASED)
function checkInteractions() {
    let resultText = "✅ Safe Combination";
    let className = "safe";

    for (let i = 0; i < medicines.length; i++) {
        for (let j = i + 1; j < medicines.length; j++) {

            let m1 = medicines[i].name.toLowerCase();
            let m2 = medicines[j].name.toLowerCase();

            for (let k = 0; k < interactions.length; k++) {
                let d = interactions[k];

                if (
                    (m1 === d.d1 && m2 === d.d2) ||
                    (m1 === d.d2 && m2 === d.d1)
                ) {
                    if (d.risk === "high") {
                        resultText = `⚠️ HIGH RISK: ${d.d1} + ${d.d2}`;
                        className = "high";
                    } 
                    else if (d.risk === "medium") {
                        resultText = `🟡 MEDIUM RISK: ${d.d1} + ${d.d2}`;
                        className = "medium";
                    } 
                    else {
                        resultText = `🟢 LOW RISK: ${d.d1} + ${d.d2}`;
                        className = "safe";
                    }
                }
            }
        }
    }

    let result = document.getElementById("result");
    result.textContent = resultText;
    result.className = className;
}

// 🔔 Reminder notification
function scheduleReminder(name, time) {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    let now = new Date();
    let [h, m] = time.split(":");

    let reminder = new Date();
    reminder.setHours(h, m, 0);

    let delay = reminder - now;

    if (delay > 0) {
        setTimeout(() => {
            new Notification("💊 Time to take " + name);
        }, delay);
    }
}

// 🤖 AI CHAT
function askAI() {
    let input = document.getElementById("chatInput").value.toLowerCase();
    let output = "I couldn't understand.";

    for (let d of interactions) {
        if (input.includes(d.d1) && input.includes(d.d2)) {
            if (d.risk === "high") {
                output = `⚠️ HIGH RISK: ${d.d1} + ${d.d2}`;
            } else if (d.risk === "medium") {
                output = `🟡 MEDIUM RISK: ${d.d1} + ${d.d2}`;
            } else {
                output = `🟢 LOW RISK: ${d.d1} + ${d.d2}`;
            }
            break;
        }
    }

    document.getElementById("chatResult").textContent = output;
}

// 🚀 Load on start
renderList();